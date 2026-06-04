export function formatPrice(priceInCents: string, currency: string): string {
  const price = BigInt(priceInCents || "0");
  const divisor = BigInt(100);
  const fullPrice = price / divisor;
  const fractionalPart = price % divisor;
  const currencySignFromLocale = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).formatToParts(0)[0].value;
  return `${currencySignFromLocale} ${fullPrice.toLocaleString(
    "pt-BR"
  )},${fractionalPart.toString().padStart(2, "0")}`;
}
