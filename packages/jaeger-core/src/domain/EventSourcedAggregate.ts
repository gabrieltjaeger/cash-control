import { AggregateRoot } from "./AggregateRoot.js";
import type { DomainEvent } from "./DomainEvent.js";
import { UniqueEntityId } from "./UniqueEntityId.js";

/**
 * Número de eventos entre snapshots automáticos.
 *
 * Configurável por aggregate sobrescrevendo SNAPSHOT_THRESHOLD:
 *
 *   export class ComponentAggregate extends EventSourcedAggregate {
 *     protected readonly SNAPSHOT_THRESHOLD = 50;  // mais frequente
 *   }
 *
 * O valor padrão de 100 é apropriado para aggregates com histórico médio.
 * Aggregates muito voláteis (milhares de eventos) devem usar valores menores.
 * Aggregates estáveis podem usar valores maiores ou desabilitar completamente.
 */
const DEFAULT_SNAPSHOT_THRESHOLD = 100;

/**
 * Resultado de shouldTakeSnapshot() — usado pelo repositório para decidir
 * se deve chamar snapshotStore.save() após persistir novos eventos.
 */
export interface SnapshotDecision {
    readonly should: boolean;
    readonly currentVersion: number;
}

/**
 * EventSourcedAggregate — Base para Aggregate Roots com Event Sourcing.
 *
 * DIFERENÇA DO AggregateRoot CLÁSSICO:
 *
 *   AggregateRoot clássico (write-state):
 *     - Persiste o ESTADO ATUAL via UPDATE no banco
 *     - Histórico de mudanças não é preservado
 *     - Simples, eficiente, adequado para a maioria dos aggregates
 *
 *   EventSourcedAggregate:
 *     - Persiste os EVENTOS (mutações) via APPEND no Event Store
 *     - Estado é DERIVADO aplicando eventos em sequência (fold)
 *     - Histórico completo preservado para sempre
 *     - Time-travel debugging, auditoria, replay de projeções
 *     - Adequado para aggregates com histórico rico e rastreabilidade crítica
 *
 * QUANDO USAR EVENT SOURCING:
 *   - ComponentAggregate: cada declareAttribute, addDependency, etc. é auditável
 *   - ActionLogAggregate: histórico de ações do usuário
 *   - ViolationAggregate: histórico de detecção/resolução de violações
 *
 * QUANDO NÃO USAR:
 *   - ProfileAggregate: muda raramente, histórico sem valor de negócio
 *   - SessionAggregate: dados efêmeros sem necessidade de replay
 *
 * CICLO DE VIDA:
 *
 *   // Criação:
 *   const component = ComponentAggregate.create(props);  // aplica criação como evento
 *
 *   // Mutação:
 *   component.declareAttribute(attr);   // chama this.applyEvent(new AttrDeclaredEvent)
 *
 *   // Reconstituição pelo repositório:
 *   const snapshot = await snapshotStore.findLatest(id);
 *   const events = snapshot
 *     ? await eventStore.loadEventsSince(id, snapshot.version)
 *     : await eventStore.loadEvents(id);
 *   const aggregate = ComponentAggregate.reconstitute(snapshot?.state);
 *   aggregate.rehydrate(events);
 *
 * IMPLEMENTAÇÃO EM SUBCLASSES:
 *
 *   export class ComponentAggregate extends EventSourcedAggregate {
 *     private _name: ComponentName;
 *
 *     // Método de negócio — aplica via evento
 *     declareAttribute(attr: AttributeDeclaration): void {
 *       this.applyEvent(new AttributeDeclaredEvent(this.id, { attr }));
 *     }
 *
 *     // Router de eventos — chamado por applyEvent E por rehydrate
 *     protected apply(event: DomainEvent): void {
 *       if (event instanceof AttributeDeclaredEvent) {
 *         this._attributes.push(event.payload.attr);
 *       }
 *       // ... outros eventos
 *     }
 *   }
 */
export abstract class EventSourcedAggregate extends AggregateRoot {
    /**
     * Número de eventos aplicados desde a criação ou último snapshot.
     * Incrementado por cada applyEvent(). Usado para OCC no Event Store.
     */
    private _esVersion = 0;

    /**
     * Eventos aplicados nesta sessão (ainda não persistidos).
     * Análogo ao _domainEvents do AggregateRoot clássico.
     */
    private _uncommittedEvents: DomainEvent[] = [];

    /**
     * Número de eventos aplicados na reconstituição (incluindo snapshot).
     * O repositório usa para calcular expectedVersion no append().
     */
    private _baseVersion = 0;

    /**
     * Threshold para tirar snapshot. Subclasses podem sobrescrever.
     */
    protected readonly SNAPSHOT_THRESHOLD: number = DEFAULT_SNAPSHOT_THRESHOLD;

    constructor(id: UniqueEntityId<any>, createdAt?: Date, updatedAt?: Date) {
        super(id, 0, createdAt, updatedAt);
    }

    override get version(): number {
        return this._esVersion;
    }

    /**
     * Versão no momento da reconstituição — antes de novos eventos.
     * O Event Store usa para OCC: append(id, type, events, expectedVersion).
     */
    get baseVersion(): number {
        return this._baseVersion;
    }

    get uncommittedEvents(): ReadonlyArray<DomainEvent> {
        return this._uncommittedEvents;
    }

    /**
     * Chamado pelo repositório após persistir os eventos no Event Store.
     */
    public clearUncommittedEvents(): void {
        this._uncommittedEvents = [];
    }

    /**
     * Aplica um evento ao estado do aggregate E o enfileira para persistência.
     *
     * Uso nos métodos de negócio:
     *
     *   declareAttribute(attr: AttributeDeclaration): void {
     *     this.applyEvent(new AttributeDeclaredEvent(this.id, { attr }));
     *   }
     */
    protected applyEvent(event: DomainEvent): void {
        this.apply(event);
        this._esVersion++;
        this._uncommittedEvents.push(event);
        this.incrementChronos();
    }

    /**
     * Reconstitui o estado do aggregate a partir de eventos históricos.
     * Chamado pelo repositório após carregar eventos do Event Store.
     * NÃO enfileira eventos para persistência (são históricos, já persistidos).
     *
     * @param events  Eventos do Event Store (pode ser delta desde o snapshot)
     * @param snapshotVersion  Versão do snapshot base (0 se sem snapshot)
     */
    public rehydrate(
        events: ReadonlyArray<DomainEvent>,
        snapshotVersion = 0,
    ): void {
        this._esVersion = snapshotVersion;
        this._baseVersion = snapshotVersion;

        for (const event of events) {
            this.apply(event);
            this._esVersion++;
        }

        this._baseVersion = this._esVersion;
    }

    /**
     * Decide se deve tirar snapshot após os eventos desta sessão.
     *
     * Regra: tirar snapshot quando a versão atual cruzou um múltiplo
     * do SNAPSHOT_THRESHOLD desde a última vez.
     *
     * Ex: threshold=100, baseVersion=90, version=105
     *   → cruzou o múltiplo 100 → should=true
     *
     * Ex: threshold=100, baseVersion=90, version=95
     *   → não cruzou nenhum múltiplo → should=false
     */
    public shouldTakeSnapshot(): SnapshotDecision {
        if (this.SNAPSHOT_THRESHOLD <= 0) {
            return { should: false, currentVersion: this._esVersion };
        }

        const prevMultiple = Math.floor(
            this._baseVersion / this.SNAPSHOT_THRESHOLD,
        );
        const currMultiple = Math.floor(
            this._esVersion / this.SNAPSHOT_THRESHOLD,
        );

        return {
            should: currMultiple > prevMultiple,
            currentVersion: this._esVersion,
        };
    }

    /**
     * Serializa o estado atual para snapshot.
     * Subclasses DEVEM sobrescrever para incluir todo estado relevante.
     *
     * EXEMPLO:
     *
     *   protected serializeState(): Record<string, unknown> {
     *     return {
     *       name: this._name.value,
     *       type: this._type.value,
     *       attributes: this._attributes.map(a => a.toPlainObject()),
     *       moduleId: this._moduleId,
     *     };
     *   }
     */
    protected serializeState(): Record<string, unknown> {
        throw new Error(
            `${this.constructor.name} must implement serializeState() ` +
                `to support snapshots.`,
        );
    }

    /**
     * Reconstitui estado a partir de um snapshot serializado.
     * Subclasses DEVEM sobrescrever se sobrescreveram serializeState().
     *
     * EXEMPLO:
     *
     *   protected restoreFromSnapshot(state: Record<string, unknown>): void {
     *     this._name = ComponentName.reconstitute(state.name as string);
     *     this._type = ComponentType.reconstitute(state.type as string);
     *     // ...
     *   }
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected restoreFromSnapshot(_state: Record<string, unknown>): void {
        throw new Error(
            `${this.constructor.name} must implement restoreFromSnapshot() ` +
                `to support snapshots.`,
        );
    }

    /**
     * Serializa o estado para string JSON (chamado pelo repositório).
     */
    public toSnapshotPayload(): string {
        return JSON.stringify({
            id: this.id,
            version: this._esVersion,
            state: this.serializeState(),
        });
    }

    /**
     * Restaura estado de um JSON de snapshot (chamado pelo repositório).
     */
    public fromSnapshotPayload(payload: string): void {
        const parsed = JSON.parse(payload) as {
            id: string;
            version: number;
            state: Record<string, unknown>;
        };
        this.restoreFromSnapshot(parsed.state);
        this._esVersion = parsed.version;
        this._baseVersion = parsed.version;
    }

    /**
     * Router de eventos — implementado pelas subclasses.
     *
     * Chamado por applyEvent() (mutação nova) E por rehydrate() (reconstituição).
     * NUNCA incrementa version diretamente — isso é responsabilidade de applyEvent.
     *
     * INVARIANTE: apply() é uma função PURA de estado.
     * Não produz efeitos colaterais além de mudar o estado do aggregate.
     *
     * EXEMPLO:
     *
     *   protected apply(event: DomainEvent): void {
     *     if (event instanceof ComponentDeclaredEvent) {
     *       this._name = ComponentName.reconstitute(event.payload.name);
     *       return;
     *     }
     *     if (event instanceof AttributeDeclaredEvent) {
     *       this._attributes.push(event.payload.attr);
     *       return;
     *     }
     *     // eventos desconhecidos são ignorados (tolerância para novos eventos)
     *   }
     */
    protected abstract override apply(event: DomainEvent): void;
}
