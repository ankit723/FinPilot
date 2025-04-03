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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileFormProps {
  initialData: Customer | null;
}

const formSchema = z.object({
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
  address: z.string()
    .min(5, "Address is required and must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zipCode: z.string().min(1, "Zip/Postal code is required"),
  country: z.string().min(1, "Country is required"),
  employmentStatus: z.enum(["EMPLOYED", "SELF_EMPLOYED", "UNEMPLOYED", "STUDENT", "RETIRED"]),
  annualIncome: z.string().min(1, "Annual income is required"),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipCode: initialData?.zipCode || "",
      country: initialData?.country || "United States",
      employmentStatus: (initialData?.employmentStatus as any) || "EMPLOYED",
      annualIncome: initialData?.annualIncome?.toString() || "",
      additionalInfo: initialData?.additionalInfo || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      if (initialData) {
        // Update existing profile
        const response = await fetch(`/api/banking/customers/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }
        
        toast.success("Profile updated successfully");
      } else {
        // Create new profile
        const response = await fetch("/api/banking/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create profile");
        }
        
        toast.success("Profile created successfully! You can now access all banking features.");
      }
      
      router.refresh();
      router.push("/banking/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An error occurred while saving your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSelectChange = (field: keyof FormValues, value: string) => {
    setValue(field, value as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i}
            className={`h-2.5 rounded-full flex-1 ${
              i + 1 === step ? "bg-primary" : 
              i + 1 < step ? "bg-primary/60" : "bg-muted"
            }`}
          />
        ))}
      </div>
      
      {/* Step 1: Contact Information */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number*</Label>
            <Input
              id="phone"
              placeholder="Enter your phone number"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Street Address*</Label>
            <Input
              id="address"
              placeholder="Enter your street address"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">City*</Label>
              <Input
                id="city"
                placeholder="City"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Province*</Label>
              <Input
                id="state"
                placeholder="State/Province"
                {...register("state")}
              />
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip/Postal Code*</Label>
              <Input
                id="zipCode"
                placeholder="Zip/Postal Code"
                {...register("zipCode")}
              />
              {errors.zipCode && (
                <p className="text-sm text-red-500">{errors.zipCode.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country*</Label>
              <Input
                id="country"
                placeholder="Country"
                {...register("country")}
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Step 2: Financial Information */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Financial Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="employmentStatus">Employment Status*</Label>
            <Select 
              onValueChange={(value) => handleSelectChange("employmentStatus", value)}
              defaultValue={watch("employmentStatus")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMPLOYED">Employed</SelectItem>
                <SelectItem value="SELF_EMPLOYED">Self-Employed</SelectItem>
                <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="RETIRED">Retired</SelectItem>
              </SelectContent>
            </Select>
            {errors.employmentStatus && (
              <p className="text-sm text-red-500">{errors.employmentStatus.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="annualIncome">Annual Income*</Label>
            <Input
              id="annualIncome"
              placeholder="Enter your annual income"
              {...register("annualIncome")}
            />
            {errors.annualIncome && (
              <p className="text-sm text-red-500">{errors.annualIncome.message}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Step 3: Additional Information */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Anything else you&apos;d like to share?</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Enter any additional information that might be relevant"
              {...register("additionalInfo")}
              rows={4}
            />
          </div>
          
          <Card className="bg-muted/20 border-dashed">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                By completing your profile, you agree to our terms and conditions.
                Your information will be used to provide you with banking services
                and will be kept secure according to our privacy policy.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
        ) : (
          <div></div> // Placeholder for spacing
        )}
        
        {step < totalSteps ? (
          <Button type="button" onClick={nextStep}>
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Profile"
              : "Complete Profile"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm; 