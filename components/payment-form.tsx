"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreditCard from "./credit-card";
import { InfoIcon } from "lucide-react";

type FormState = {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

type FormErrors = {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
};

export default function PaymentForm() {
  const [formState, setFormState] = useState<FormState>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const validateCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (cleaned.length !== 16 || !/^\d+$/.test(cleaned)) {
      return "Please enter a valid 16-digit card number";
    }
    return undefined;
  };

  const validateExpiryDate = (value: string) => {
    if (!/^\d{2}\/\d{4}$/.test(value)) {
      return "Please enter a valid expiry date (MM/YYYY)";
    }

    const [month, year] = value.split("/");
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
      return "Month must be between 01-12";
    }

    if (
      Number.parseInt(year) < currentYear ||
      (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
    ) {
      return "Card has expired";
    }

    return undefined;
  };

  const validateCvv = (value: string) => {
    if (!/^\d{3,4}$/.test(value)) {
      return "CVV must be 3 or 4 digits";
    }
    return undefined;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const groups = [];

    for (let i = 0; i < cleaned.length; i += 4) {
      groups.push(cleaned.slice(i, i + 4));
    }

    return groups.join(" ");
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length >= 5) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 6)}`;
    } else if (cleaned.length === 2) {
      return `${cleaned}/`;
    }

    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    }

    setFormState((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error when typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateField = (name: keyof FormState, value: string) => {
    switch (name) {
      case "cardNumber":
        return validateCardNumber(value);
      case "expiryDate":
        return validateExpiryDate(value);
      case "cvv":
        return validateCvv(value);
      default:
        return undefined;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cvv") {
      // Add a small delay before flipping back to ensure the animation is smooth
      setTimeout(() => {
        setIsCvvFocused(false);
      }, 100);
    }

    const error = validateField(name as keyof FormState, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === "cvv") {
      setIsCvvFocused(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    let hasErrors = false;
    (Object.keys(formState) as Array<keyof FormState>).forEach((key) => {
      const error = validateField(key, formState[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Form is valid, log data to console (as per requirements)
    console.log("Form submitted:", formState);

    // In a real app, you would send this data to your payment processor
    alert("Payment information submitted successfully!");
  };

  const isFormValid = () => {
    return (
      formState.cardNumber.replace(/\s/g, "").length === 16 &&
      /^\d{2}\/\d{4}$/.test(formState.expiryDate) &&
      /^\d{3,4}$/.test(formState.cvv) &&
      Object.values(errors).every((error) => !error)
    );
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
      <div className="md:col-span-5 flex justify-center md:justify-end">
        <CreditCard
          cardNumber={formState.cardNumber}
          expiryDate={formState.expiryDate}
          cvv={formState.cvv}
          isFlipped={isCvvFocused}
        />
      </div>

      <div className="md:col-span-7">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-light text-white mb-6">Payment Information</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="cardNumber" className="text-sm font-normal text-white/80 mb-2 block">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formState.cardNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  maxLength={19} // 16 digits + 3 spaces
                  className="bg-[#111111] border-[#333333] text-white h-12 rounded-md"
                  aria-invalid={!!errors.cardNumber}
                  aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
                />
                {errors.cardNumber && (
                  <p id="cardNumber-error" className="text-sm text-red-500 mt-1">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="text-sm font-normal text-white/80 mb-2 block">
                    Expiration
                  </Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YYYY"
                    value={formState.expiryDate}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    maxLength={7} // MM/YYYY
                    className="bg-[#111111] border-[#333333] text-white h-12 rounded-md"
                    aria-invalid={!!errors.expiryDate}
                    aria-describedby={errors.expiryDate ? "expiryDate-error" : undefined}
                  />
                  {errors.expiryDate && (
                    <p id="expiryDate-error" className="text-sm text-red-500 mt-1">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cvv" className="text-sm font-normal text-white/80 mb-2 block">
                    CVV/CVC
                  </Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="—"
                    value={formState.cvv}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={4}
                    className="bg-[#111111] border-[#333333] text-white h-12 rounded-md"
                    aria-invalid={!!errors.cvv}
                    aria-describedby={errors.cvv ? "cvv-error" : undefined}
                  />
                  {errors.cvv && (
                    <p id="cvv-error" className="text-sm text-red-500 mt-1">
                      {errors.cvv}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-auto px-8 py-3 h-12 rounded-full bg-[#111111] hover:bg-[#222222] text-white"
                disabled={!isFormValid()}
              >
                Continue
              </Button>
            </div>
          </form>

          <div className="space-y-2 pt-4">
            <button
              onClick={() => toggleSection("why")}
              className="w-full flex items-center justify-between py-3 text-sm text-white/80 border-b border-[#333333]"
            >
              <span>Why do you need my card?</span>
              <InfoIcon size={18} className="text-white/60" />
            </button>

            {expandedSection === "why" && (
              <div className="py-3 text-sm text-white/60">
                We need your card details to process your payment securely. Your information is encrypted and protected
                using industry-standard security protocols. We do not store your full card details on our servers.
              </div>
            )}

            <button
              onClick={() => toggleSection("future")}
              className="w-full flex items-center justify-between py-3 text-sm text-white/80 border-b border-[#333333]"
            >
              <span>How might you use my card in the future?</span>
              <InfoIcon size={18} className="text-white/60" />
            </button>

            {expandedSection === "future" && (
              <div className="py-3 text-sm text-white/60">
                If you opt for recurring payments or subscriptions, we may use your card for future authorized charges.
                You can manage your payment methods and subscriptions in your account settings at any time. We will
                always notify you before any charges are made.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-12 mt-8">
        <div className="w-full h-[2px] bg-[#222222] relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#444444]"></div>
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#4169E1]"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#444444]"></div>
        </div>
        <div className="flex justify-between text-xs text-white/60 mt-2">
          <span>Appointment</span>
          <span>Payment</span>
          <span className="invisible">Confirmation</span>
        </div>
      </div>
    </div>
  );
}
