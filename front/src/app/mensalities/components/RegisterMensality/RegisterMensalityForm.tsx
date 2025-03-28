"use client";

import { registerMensality } from "@/_actions/mensalities/POST/register-mensality";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MonthPicker } from "@/components/ui/month-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useState } from "react";

import { formatPrice } from "@/lib/format-price";
import { numberToMonth } from "@/lib/month";

const registerMensalityFormSchema = z
  .object({
    month: z.enum([
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ]),
    year: z.number().int().positive().gt(0),
    priceInCents: z.string().regex(/^\d+$/, "Price must be a valid number"),
  })
  .refine(
    (data) => {
      return !!data.month && !!data.year;
    },
    {
      message: "Both month and year must be selected",
      path: ["year"],
    }
  );

type RegisterMensalityFormSchema = z.infer<typeof registerMensalityFormSchema>;

export default function RegisterMensalityForm() {
  const form = useForm<RegisterMensalityFormSchema>({
    resolver: zodResolver(registerMensalityFormSchema),
    defaultValues: {
      month: numberToMonth(new Date().getMonth() + 1),
      year: new Date().getFullYear(),
      priceInCents: "",
    },
  });

  const onSubmit = async (data: RegisterMensalityFormSchema) => {
    console.log(data);
    try {
      const response = await registerMensality(data);

      if (response && response.message) {
        throw new Error(response.message);
      }

      form.reset();
      toast.success("Mensality registered successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      return;
    }
  };

  const [date, setDate] = useState<Date>(new Date());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="year"
          render={() => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <FormControl>
                <MonthPicker
                  className="w-full"
                  value={date}
                  onChange={(newDate) => {
                    if (newDate) {
                      setDate(newDate);
                      form.setValue("year", newDate.getFullYear(), {
                        shouldValidate: true,
                      });
                      form.setValue(
                        "month",
                        numberToMonth(newDate.getMonth() + 1),
                        { shouldValidate: true }
                      );
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceInCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value ? formatPrice(field.value, "BRL") : ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    field.onChange(rawValue);
                    form.setValue("priceInCents", rawValue, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    form.trigger("priceInCents");
                  }}
                  onBlur={() => form.trigger("priceInCents")}
                  placeholder="Enter price..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <LoadingSpinner />}
          Register
        </Button>
      </form>
    </Form>
  );
}
