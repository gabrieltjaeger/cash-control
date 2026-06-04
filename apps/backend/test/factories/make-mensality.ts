import { Mensality, MensalityProps } from "@core/entities/mensality";
import { CUID } from "@core/entities/types/CUID";

export function makeMensality(
  override: Partial<MensalityProps> = {},
  id?: CUID
) {
  const mensality = Mensality.create({
    month: "JAN",
    year: 2025,
    priceInCents: 10000n,
    ...override,
    id,
  });

  return mensality;
}
