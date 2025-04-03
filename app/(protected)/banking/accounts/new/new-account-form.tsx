"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Customer } from "@prisma/client";
import { toast } from "sonner";
import GlassCard from "@/app/components/ui/glass-card";
import ProfessionalText from "@/app/components/ui/neon-text";
import ProfessionalBorder from "@/app/components/ui/neo-border";

interface NewAccountFormProps {
  customer: Customer;
}

const formSchema = z.object({
  type: z.enum(["SAVINGS", "CURRENT", "FIXED_DEPOSIT"], {
    required_error: "Account type is required",
  }),
  initialDeposit: z.coerce
    .number()
    .min(500, "Initial deposit must be at least ₹500")
    .nonnegative("Amount must be positive"),
  // Only required for fixed deposits
  tenure: z.coerce
    .number()
    .min(1)
    .optional()
});

type FormValues = z.infer<typeof formSchema>;

const NewAccountForm = ({ customer }: NewAccountFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountType, setAccountType] = useState<"SAVINGS" | "CURRENT" | "FIXED_DEPOSIT" | null>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialDeposit: 500,
      type: "SAVINGS",
      tenure: 12,
    },
  });

  // Watch the type to conditionally show/hide fields
  const selectedType = watch("type");

  // Update the visible selection when the form value changes or on mount
  useEffect(() => {
    const currentType = watch("type");
    if (currentType) {
      setAccountType(currentType);
    } else {
      // If no type is set in the form, default to SAVINGS and set it in the form
      setAccountType("SAVINGS");
      setValue("type", "SAVINGS", { shouldValidate: true });
    }
  }, [watch, setValue]);

  // Handle account type selection
  const handleAccountTypeSelect = (type: "SAVINGS" | "CURRENT" | "FIXED_DEPOSIT") => {
    setAccountType(type);
    setValue("type", type, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      console.log("Submitting account creation data:", data);
      
      // Ensure account type is set
      if (!data.type) {
        toast.error("Please select an account type");
        setIsSubmitting(false);
        return;
      }
      
      // Ensure tenure is set for fixed deposits
      if (data.type === "FIXED_DEPOSIT" && !data.tenure) {
        toast.error("Please specify a tenure for your Fixed Deposit");
        setIsSubmitting(false);
        return;
      }
      
      const requestData = {
        customerId: customer.id,
        type: data.type,
        initialDeposit: data.initialDeposit,
        tenure: data.type === "FIXED_DEPOSIT" ? data.tenure : undefined,
      };
      
      console.log("Request data being sent:", requestData);
      
      const response = await fetch("/api/banking/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log("Response from account creation:", responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create account");
      }
      
      toast.success("Account created successfully");
      router.push("/banking/accounts");
      router.refresh();
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred while creating your account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard intensity="medium" className="p-6 border-none max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <ProfessionalText color="blue" size="2xl">
          Open a New Account
        </ProfessionalText>
        <p className="text-white/70 mt-2">
          Choose your preferred account type and set initial deposit amount
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-white">Account Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: "SAVINGS", title: "Savings Account", description: "Earn interest on your savings with easy access" },
              { value: "CURRENT", title: "Current Account", description: "For business transactions with no withdrawal limits" },
              { value: "FIXED_DEPOSIT", title: "Fixed Deposit", description: "Higher interest rates for fixed terms" }
            ].map((option) => (
              <div 
                key={option.value}
                className="relative"
                onMouseEnter={() => setHoveredType(option.value)}
                onMouseLeave={() => setHoveredType(null)}
              >
                <ProfessionalBorder 
                  color={accountType === option.value ? "blue" : (hoveredType === option.value ? "blue" : "white")} 
                  variant={accountType === option.value ? "solid" : "subtle"}
                  className="h-full"
                >
                  <label 
                    className={`block h-full cursor-pointer transition-colors duration-300`}
                  >
                    <GlassCard 
                      intensity={accountType === option.value ? "medium" : "light"}
                      className="h-full p-4"
                    >
                      <div className="flex flex-col items-center">
                        <input 
                          type="radio" 
                          value={option.value}
                          {...register("type")}
                          className="sr-only"
                          onChange={() => handleAccountTypeSelect(option.value as any)}
                        />
                        <h3 className="text-lg font-medium text-white mb-1">{option.title}</h3>
                        <p className="text-sm text-white/70 text-center">
                          {option.description}
                        </p>
                      </div>
                    </GlassCard>
                  </label>
                </ProfessionalBorder>
              </div>
            ))}
          </div>
          {errors.type && (
            <p className="text-red-400 text-sm">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="initialDeposit" className="text-white">Initial Deposit (min ₹500)</Label>
          <div className="relative">
            <ProfessionalBorder color="white" variant="subtle">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-white/70">₹</span>
                </div>
                <Input
                  id="initialDeposit"
                  type="number"
                  className="pl-8 bg-white/10 border-none text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400/50"
                  placeholder="500.00"
                  min={500}
                  step={1}
                  {...register("initialDeposit")}
                />
              </div>
            </ProfessionalBorder>
          </div>
          {errors.initialDeposit && (
            <p className="text-red-400 text-sm">{errors.initialDeposit.message}</p>
          )}
        </div>

        {/* Additional fields for Fixed Deposit */}
        {selectedType === "FIXED_DEPOSIT" && (
          <GlassCard intensity="light" className="p-4 border-none">
            <div className="space-y-2">
              <Label htmlFor="tenure" className="text-white">Tenure (in months)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[3, 6, 12, 24, 36, 48, 60].map((month) => (
                  <ProfessionalBorder 
                    key={month}
                    color={watch("tenure") === month ? "blue" : "white"} 
                    variant={watch("tenure") === month ? "solid" : "subtle"}
                  >
                    <label 
                      className="block cursor-pointer text-center py-2"
                    >
                      <input 
                        type="radio" 
                        className="sr-only"
                        onClick={() => setValue("tenure", month, { shouldValidate: true })}
                        name="tenureOption"
                        checked={watch("tenure") === month}
                        onChange={() => {}}
                      />
                      <span className="text-sm font-medium text-white">{month} months</span>
                    </label>
                  </ProfessionalBorder>
                ))}
                <div className="col-span-2 md:col-span-4 mt-2">
                  <ProfessionalBorder color="white" variant="subtle">
                    <Input
                      id="tenure"
                      type="number"
                      placeholder="Custom tenure in months"
                      className="bg-white/10 border-none text-white placeholder:text-white/50"
                      min={1}
                      step={1}
                      {...register("tenure")}
                    />
                  </ProfessionalBorder>
                </div>
              </div>
              {errors.tenure && (
                <p className="text-red-400 text-sm">{errors.tenure.message}</p>
              )}
              <p className="text-xs text-white/60 mt-1">
                Note: Fixed Deposits have early withdrawal penalties. Longer terms typically offer higher interest rates.
              </p>
            </div>
          </GlassCard>
        )}

        <div className="border-t border-white/10 pt-4">
          <ProfessionalBorder color="blue" variant="solid" className="w-full">
            <Button 
              type="submit" 
              disabled={isSubmitting || !accountType} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none h-12"
            >
              {isSubmitting ? "Opening Account..." : "Open Account"}
            </Button>
          </ProfessionalBorder>
          {!accountType && (
            <p className="text-sm text-red-400 mt-2 text-center">Please select an account type</p>
          )}
        </div>
      </form>
    </GlassCard>
  );
};

export default NewAccountForm; 