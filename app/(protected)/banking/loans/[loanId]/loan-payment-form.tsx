"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface LoanPaymentFormProps {
  loan: any; 
}

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Payment amount must be at least $1")
    .nonnegative("Amount must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

const LoanPaymentForm = ({ loan }: LoanPaymentFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total amount paid and remaining amount
  const totalPaid = loan.payments.reduce(
    (sum: number, payment: any) => sum + payment.amount,
    0
  );
  
  const remainingAmount = loan.amount - totalPaid;

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: Math.min(100, remainingAmount),
    },
  });

  const amount = watch("amount");

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if payment amount exceeds remaining balance
      if (data.amount > remainingAmount) {
        toast.error("Payment amount cannot exceed the remaining loan balance");
        return;
      }
      
      const response = await fetch(`/api/banking/loans/${loan.id}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: data.amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment failed");
      }
      
      toast.success("Payment successful");
      router.refresh();
    } catch (error: any) {
      console.error("Error making loan payment:", error);
      toast.error(error.message || "An error occurred while processing your payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Payment Amount</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
          <Input
            id="amount"
            type="number"
            className="pl-8"
            placeholder="100.00"
            min={1}
            max={remainingAmount}
            step={0.01}
            {...register("amount")}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
        {amount > remainingAmount && (
          <p className="text-sm text-red-500">
            Payment amount cannot exceed remaining balance
          </p>
        )}
      </div>

      <div className="rounded-md border p-4 bg-muted/20">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Remaining Balance:</span>
            <span className="font-medium">${remainingAmount.toFixed(2)}</span>
          </div>
          {amount && amount > 0 && amount <= remainingAmount && (
            <div className="flex justify-between">
              <span>New Balance After Payment:</span>
              <span className="font-medium">${(remainingAmount - amount).toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={
          isSubmitting || 
          !amount || 
          amount <= 0 || 
          amount > remainingAmount
        } 
        className="w-full"
      >
        {isSubmitting ? "Processing..." : "Make Payment"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Payments are processed immediately. Once submitted, payments cannot be undone.
      </p>
    </form>
  );
};

export default LoanPaymentForm; 