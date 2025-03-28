export function formatPrice(priceInCents: string, currency: string): string {
  const price = BigInt(priceInCents || "0");
  const fullPrice = price / 100n;
  const fractionalPart = price % 100n;
  const currencySignFromLocale = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).formatToParts(0)[0].value;
  return `${currencySignFromLocale} ${fullPrice.toLocaleString(
    "pt-BR"
  )},${fractionalPart.toString().padStart(2, "0")}`;
}
