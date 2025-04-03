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

interface TransactionFormProps {
  account: any;
}

const formSchema = z.object({
  type: z.enum(["DEPOSIT", "WITHDRAWAL"], {
    required_error: "Transaction type is required",
  }),
  amount: z.coerce
    .number()
    .min(1, "Amount must be at least ₹1")
    .nonnegative("Amount must be positive"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionForm = ({ account }: TransactionFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionType, setTransactionType] = useState<"DEPOSIT" | "WITHDRAWAL" | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const amount = watch("amount");

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if withdrawal amount exceeds balance
      if (data.type === "WITHDRAWAL" && data.amount > account.balance) {
        toast.error("Insufficient funds for this withdrawal");
        return;
      }
      
      const response = await fetch("/api/banking/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: account.id,
          type: data.type,
          amount: data.amount,
          description: data.description || 
            `${data.type === "DEPOSIT" ? "Deposit to" : "Withdrawal from"} account`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transaction failed");
      }
      
      toast.success(
        `${data.type === "DEPOSIT" ? "Deposit" : "Withdrawal"} completed successfully`
      );
      router.refresh();
    } catch (error: any) {
      console.error("Error processing transaction:", error);
      toast.error(error.message || "An error occurred while processing your transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Transaction Type</Label>
        <div className="grid grid-cols-2 gap-4">
          <div 
            className={`border rounded-md p-3 cursor-pointer text-center transition-colors ${
              transactionType === "DEPOSIT" 
                ? "border-green-500 bg-green-50 dark:bg-green-950/30" 
                : "hover:border-muted-foreground"
            }`}
            onClick={() => setTransactionType("DEPOSIT")}
          >
            <input 
              type="radio" 
              value="DEPOSIT" 
              className="sr-only"
              {...register("type")} 
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto mb-1 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 7-7 7 7"/>
              <path d="M12 19V5"/>
            </svg>
            <h3 className="text-sm font-medium">Deposit</h3>
          </div>
          <div 
            className={`border rounded-md p-3 cursor-pointer text-center transition-colors ${
              transactionType === "WITHDRAWAL" 
                ? "border-red-500 bg-red-50 dark:bg-red-950/30" 
                : "hover:border-muted-foreground"
            }`}
            onClick={() => setTransactionType("WITHDRAWAL")}
          >
            <input 
              type="radio" 
              value="WITHDRAWAL" 
              className="sr-only"
              {...register("type")} 
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto mb-1 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"/>
              <path d="m5 12 7 7 7-7"/>
            </svg>
            <h3 className="text-sm font-medium">Withdrawal</h3>
          </div>
        </div>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">₹</span>
          </div>
          <Input
            id="amount"
            type="number"
            className="pl-8"
            placeholder="0.00"
            min={1}
            step={1}
            {...register("amount")}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
        {transactionType === "WITHDRAWAL" && amount > account.balance && (
          <p className="text-sm text-red-500">
            Insufficient funds. Available balance: ₹{account.balance.toFixed(2)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          placeholder="Enter a description for this transaction"
          {...register("description")}
        />
      </div>

      <Button 
        type="submit" 
        disabled={
          isSubmitting || 
          !transactionType || 
          (transactionType === "WITHDRAWAL" && amount > account.balance)
        } 
        className="w-full"
        variant={transactionType === "DEPOSIT" ? "default" : "outline"}
      >
        {isSubmitting 
          ? "Processing..." 
          : transactionType === "DEPOSIT" 
            ? "Make Deposit" 
            : "Make Withdrawal"}
      </Button>
    </form>
  );
};

export default TransactionForm; 