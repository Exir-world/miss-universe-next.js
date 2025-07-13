import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "@/context/api";
import { RiCloseLargeFill } from "react-icons/ri";
import Ton from "../../public/Ton.svg";
import Image from "next/image";
import { useLoginStoreState } from "@/stores/context";
import PhoneInput from "@/components/phoneNumberInput/PhoneInput";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import exclamation from "../../public/excalmation.svg";

const WithdrawButton = ({ onTransaction }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [otp, setOtp] = useState("");
  const [otpResponse, setOtpResponse] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const { api } = useApi();
  const t = useTranslations();
  const [errors, setErrors] = useState<{
    amount?: string;
    wallet?: string;
    otp?: string;
  }>({});

  const { userData } = useLoginStoreState();
  const hasRegisterPId = userData.user.pid;
  //   console.log(userData.user.pid, "userData.user.pid**");

  // const hasRegisterPId = false;

  const [registerStep, setRegisterStep] = useState<"register" | "withdraw">(
    hasRegisterPId ? "withdraw" : "register"
  );
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [walletId, setWalletId] = useState<string>("");
  const [feeCoinId, setFeeCoinId] = useState<string>("");
  const [method, setMethod] = useState<string>("TON_NETWORK"); // or PAYPAL, etc.
  const [description, setDescription] = useState<string>(
    "Withdrawal for personal us"
  );

  const [walletInfo, setWalletInfo] = useState("");
  const [coinList, setCoinList] = useState([]);

  useEffect(() => {
    setRegisterStep(hasRegisterPId ? "withdraw" : "register");
  }, [hasRegisterPId]);

  // Validators
  const validateAmount = (value: string) => {
    if (!value) return "Amount is required.";
    const num = Number(value);
    if (isNaN(num) || num <= 0) return "Enter a valid positive number.";
    return "";
  };

  const validateWallet = (value: string) => {
    if (!value) return "Wallet address is required.";
    // Simple Solana address check (base58, 32-44 chars)
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value))
      return "Enter a valid Solana address.";
    return "";
  };

  const validateOtp = (value: string) => {
    if (value.length < 3 || !value) return "OTP code is required.";
    return "OTP must be at least 3 digits.";
  };

  const identifyCoinId = (coin: string): string | null => {
    if (!coinList.length) return null;

    const currency = coinList.find((item) => item.name === coin);
    return currency ? currency.id : null;
  };

  // Validate on change
  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      amount: amount ? validateAmount(amount) : undefined,
    }));
  }, [amount]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      wallet: wallet ? validateWallet(wallet) : undefined,
    }));
  }, [wallet]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      otp: otp ? otp : undefined,
    }));
  }, [otp]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const amountError = validateAmount(amount);
  //   const walletError = validateWallet(wallet);
  //   const otpError = validateOtp(otp);

  //   setErrors({
  //     amount: amountError,
  //     wallet: walletError,
  //     otp: otpError,
  //   });

  //   if (amountError || walletError || otpError) {
  //     return;
  //   }
  //   // handle submission
  //   setShowModal(false);
  // };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const handleOtpClick = useCallback(async () => {
    setOtpLoading(true);
    try {
      const res = await api.post("/otp/generate", {
        type: "email",
      });
      setOtpResponse(res.data);
      setOtpTimer(60);
    } catch (e) {
      console.log(e);
      setErrors((prev) => ({
        ...prev,
        otp: "Failed to send OTP. Please try again.",
      }));
    }
    setOtpLoading(false);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    // if (!registerPhone) {
    //   setRegisterError("Phone number is required.");
    //   toast.error("Phone number is required.");
    //   return;
    // }
    // if (!registerEmail) {
    //   setRegisterError("Email is required.");
    //   toast.error("Email is required.");
    //   return;
    // }
    setRegisterLoading(true);

    try {
      const res = await api.post("/mainuser/register", {
        phoneNumber: registerPhone,
        email: registerEmail,
      });
      console.log(res.data);

      setRegisterStep("withdraw");
      toast.success("Registration successful!");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Registration failed.";
      setRegisterError(errorMsg);
      toast.error(errorMsg);
    }
    setRegisterLoading(false);
  };

  const hanldeWithdraw = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amountError = validateAmount(amount);
    const walletError = validateWallet(wallet);
    const otpError = validateOtp(otp);
    setErrors({ amount: amountError, wallet: walletError, otp: otpError });
    if (amountError || walletError) return;
    const data = {
      walletId: Number(walletId),
      amount: Number(amount),
      method,
      feeCoinId: Number(feeCoinId),
      destinationWalletAddress: wallet,
      otp,
      description: description,
    };

    try {
      const res = await api.post(`withdraw-requests/with-deposit`, data, {
        headers: {
          "X-Game": process.env.NEXT_PUBLIC_GAME_NAME,
        },
      });
      if (res.status === 200 || res.status === 201) {
        setShowModal(false);
        toast.success(t("withdraw.registerSuccess"));
        onTransaction(true);
      } else {
        toast.error(t("withdraw.registerFailed"));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("withdraw.registerFailed")
      );
    }
  };

  const fetchAllCoins = async () => {
    try {
      const { data } = await api.get("/coins");
      setCoinList(data.data);
      setFeeCoinId("3");
    } catch (err) {
      console.error(err);
    }
  };

  const getWalletData = async () => {
    try {
      const { data } = await api.get("/wallets/user/tg");
      const info = data.data.map((el: any) => ({
        coin: el.coin.name,
        balance: el.balance,
        id: el.id,
        icon: el.coin.icon,
      }));
      setWalletInfo(info);
      setWalletId(info[0]?.id);
    } catch (e) {
      console.error(e);
    }
  };

  // Example: fetch walletId and feeCoinId on mount (replace with your real API logic)
  useEffect(() => {
    fetchAllCoins();
    getWalletData();
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
          setErrors({});
        }}
        className="px-5 py-2 w-full bg-transparent rounded-full shadow-md border-2 border-[#FF4ED3] text-white"
      >
        {t("profile.withdraw")}
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center mx-auto bg-transparent bg-opacity-70"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-[#7D7D7D4D] backdrop-blur-2xl rounded-md shadow-xl w-full mx-4 p-5 max-w-sm border border-[#FF4ED3] pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex justify-end text-pink-400">
                <RiCloseLargeFill
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer"
                  size={24}
                />
              </div>
              <h2 className="text-lg font-bold mb-4 text-center">
                {" "}
                {t("profile.withdraw")}
              </h2>
              {registerStep === "register" ? (
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
                      {t("profile.email")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4ED3]"
                      disabled={registerLoading}
                    />
                  </div>
                  {registerError && (
                    <p className="text-red-500 text-xs mt-1">{registerError}</p>
                  )}
                  <div className="flex justify-between mt-6">
                    <button
                      type="submit"
                      className="w-full gap-1 py-3 text-sm rounded-full bg-[#50A7EA] text-white flex items-center justify-center"
                    >
                      {registerLoading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  // onSubmit={handleSubmit}
                  className="space-y-4"
                  autoComplete="off"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("profile.amount")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`w-full border ${
                        errors.amount ? "border-red-500" : "border-gray-300"
                      } rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4ED3]`}
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.amount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("profile.walletAddress")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      className={`w-full border ${
                        errors.wallet ? "border-red-500" : "border-gray-300"
                      } rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4ED3]`}
                    />
                    {errors.wallet && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.wallet}
                      </p>
                    )}
                  </div>
                  <div className="flex w-full items-center justify-center gap-1 py-1">
                    <Image src={exclamation} alt="svg"></Image>
                    <p className="font-[400] text-[14px]">
                      {t("global.withdrawWarn")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("profile.otpCode")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={`flex-1 border ${
                          errors.otp ? "border-red-500" : "border-gray-300"
                        } rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4ED3]`}
                      />
                      <button
                        type="button"
                        onClick={handleOtpClick}
                        disabled={otpTimer > 0 || otpLoading}
                        className={`text-xs rounded-full ${
                          otpTimer > 0 || otpLoading
                            ? "text-[#FF4ED3] cursor-not-allowed"
                            : "bg-transparent text-[#FF4ED3]"
                        }`}
                      >
                        {otpLoading
                          ? "Sending..."
                          : otpTimer > 0
                          ? `${otpTimer}`
                          : "Send"}
                      </button>
                    </div>
                    {/* {errors.otp && (
                      <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                    )} */}
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("profile.description")}
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4ED3]"
                    />
                  </div> */}
                  <div className="flex justify-between mt-6">
                    <button
                      type="submit"
                      onClick={hanldeWithdraw}
                      className="w-full gap-1 py-3 text-sm rounded-full bg-[#50A7EA] text-white flex items-center justify-center"
                    >
                      <span>{t("profile.payButton")}</span>
                      <Image src={Ton} alt="ton" width={17} height={17}></Image>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WithdrawButton;
