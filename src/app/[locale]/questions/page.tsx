"use client";
import PhoneInput from "@/components/phoneNumberInput/PhoneInput";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLoginStoreState } from "@/stores/context";
import { toast } from "react-toastify";

const QuestionsPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const { setLoginData, login } = useLoginStoreState();
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async (
    phoneNumber: string,
    countryCode: string
  ) => {
    setLoading(true);
    try {
      setLoginData({ phoneNumber: phoneNumber });
      const success = await login(countryCode);
      if (success) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          {t("Enter your phone number")}
        </h1>
        <PhoneInput onSubmit={handlePhoneSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default QuestionsPage;
