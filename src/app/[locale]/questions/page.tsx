'use client';
import PhoneInput from "@/components/phoneNumberInput/PhoneInput";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLoginStoreState } from "@/stores/context";
import { toast } from "react-toastify";

const QuestionsPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const { loginData, setLoginData, login } = useLoginStoreState();
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async (phoneNumber: string, countryCode: string) => {
    setLoading(true);
    try {
      const success = await login(countryCode, phoneNumber);
      if (success) {
        toast.success(t("Login successful"));
        router.push("/");
      } else {
        toast.error(t("Login failed"));
      }
    } catch (error) {
      toast.error(t("An error occurred"));
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
