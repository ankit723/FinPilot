"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Customer } from "@prisma/client";
import { toast } from "sonner";

interface LoanApplicationFormProps {
  customer: Customer;
}

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(1000, "Loan amount must be at least $1,000")
    .nonnegative("Amount must be positive"),
  interest: z.coerce
    .number()
    .min(1, "Interest rate must be at least 1%")
    .max(30, "Interest rate cannot exceed 30%"),
  term: z.coerce
    .number()
    .int("Term must be a whole number")
    .min(6, "Term must be at least 6 months")
    .max(360, "Term cannot exceed 360 months (30 years)"),
});

type FormValues = z.infer<typeof formSchema>;

const LoanApplicationForm = ({ customer }: LoanApplicationFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 5000,
      interest: 5,
      term: 12,
    },
  });

  const amount = watch("amount");
  const interest = watch("interest");
  const term = watch("term");

  // Calculate monthly payment using the formula: P = (r*PV)/(1-(1+r)^-n)
  // Where:
  // P = Monthly Payment
  // PV = Present Value (loan amount)
  // r = Monthly Interest Rate (annual rate / 12 / 100)
  // n = Number of Payments (term in months)
  const calculateMonthlyPayment = () => {
    if (!amount || !interest || !term) return 0;
    
    const monthlyRate = interest / 12 / 100;
    const denominator = 1 - Math.pow(1 + monthlyRate, -term);
    
    if (denominator === 0) return 0;
    
    const monthlyPayment = (monthlyRate * amount) / denominator;
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - amount;

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/banking/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer.id,
          amount: data.amount,
          interest: data.interest,
          term: data.term,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit loan application");
      }
      
      toast.success("Loan application submitted successfully");
      router.push("/banking/loans");
      router.refresh();
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast.error("An error occurred while submitting your loan application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Loan Amount</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <Input
            id="amount"
            type="number"
            className="pl-8"
            placeholder="5000.00"
            min={1000}
            step={100}
            {...register("amount")}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="interest">Interest Rate (%)</Label>
        <div className="relative">
          <Input
            id="interest"
            type="number"
            placeholder="5.0"
            min={1}
            max={30}
            step={0.1}
            {...register("interest")}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">%</span>
          </div>
        </div>
        {errors.interest && (
          <p className="text-sm text-red-500">{errors.interest.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="term">Term (Months)</Label>
        <Input
          id="term"
          type="number"
          placeholder="12"
          min={6}
          max={360}
          step={1}
          {...register("term")}
        />
        {errors.term && (
          <p className="text-sm text-red-500">{errors.term.message}</p>
        )}
      </div>

      <div className="rounded-md border p-4 bg-muted/20">
        <h3 className="font-medium mb-2">Loan Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Monthly Payment:</span>
            <span className="font-medium">${monthlyPayment.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Payment:</span>
            <span className="font-medium">${totalPayment.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Interest:</span>
            <span className="font-medium">${totalInterest.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting Application..." : "Submit Loan Application"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this application, you agree to the terms and conditions of our loan agreement.
        Your application will be reviewed and you &apos;ll be notified of the decision.
      </p>
    </form>
  );
};

export default LoanApplicationForm; 