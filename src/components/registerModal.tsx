"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "./phoneNumberInput/PhoneInput";
import { useApi } from "@/context/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { useLoginStoreState } from "@/stores/context";
import useClickOutside from "@/hooks/useClickOutside";

const validateEmail = (email: string) =>
  /\S+@\S+\.\S+/.test(email) ? email : null;

const RegisterModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const t = useTranslations();
  const { api } = useApi();

  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [disableBtn, setDisableBtn] = useState(false);
  const { getMe } = useLoginStoreState();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    if (!registerPhone) {
      const msg = t("formValidations.phoneRequired");
      setRegisterError(msg);
      toast.error(msg);
      return;
    }

    if (!registerEmail || !validateEmail(registerEmail)) {
      const msg = t("formValidations.emailRequired");
      setRegisterError(msg);
      toast.error(msg);
      return;
    }

    setRegisterLoading(true);

    try {
      setDisableBtn(true);
      const res = await api.post("/mainuser/register", {
        phoneNumber: registerPhone,
        email: validateEmail(registerEmail),
        nickname: "",
      });
      // if (res.status == 200 || res.status == 201) {
      await getMe();
      // }
      toast.success(
        t("auth.registrationSuccess") || "Registration successful!"
      );
      // optionally close modal or go to next step
      onClose?.();
    } catch (err: any) {
      setDisableBtn(false);

      const errorMsg = err?.response?.data?.message || "Registration failed.";
      setRegisterError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setRegisterLoading(false);
      setDisableBtn(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const modalRef = useRef(null);
  useClickOutside(modalRef, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className=" rounded-xl shadow-lg w-[97%] max-w-md p-6 relative bg-black/95"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400  text-xl p-1 "
            >
              <IoMdClose size={26} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">
              {t("auth.registerTitle") || "Sign Up"}
            </h2>

            <form
              onSubmit={handleRegister}
              className="space-y-4"
              autoComplete="off"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("profile.phoneNumber")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  onChange={(phone) => setRegisterPhone(phone)}
                  loading={registerLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("profile.email")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#50A7EA] "
                  disabled={registerLoading}
                />
              </div>

              {registerError && (
                <p className="text-red-500 text-xs mt-1">{registerError}</p>
              )}

              <button
                disabled={disableBtn}
                type="submit"
                className="w-full py-3 text-sm rounded-full bg-[#50A7EA] text-white flex items-center justify-center"
              >
                {registerLoading
                  ? t("auth.registering") || "Registering..."
                  : t("auth.register") || "Register"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
