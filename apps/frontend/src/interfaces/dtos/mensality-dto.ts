import { Month } from "@/types/month";

export interface MensalityDTO {
  id: string;
  month: Month;
  year: number;
  priceInCents: string;
  createdAt: Date;
  updatedAt: Date | null;
}
