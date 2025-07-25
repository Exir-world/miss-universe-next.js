import React, { useState } from "react";
import countrieCodes from "./countries.json";
import { motion } from "framer-motion";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useTranslations } from "next-intl";

interface Country {
  code: string;
  name: string;
  flagClass: string;
  telephoneCode: string;
}

interface PhoneInputProps {
  onChange?: (phoneNumber: string) => void;
  loading?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  onChange,
  loading = false,
}) => {
  const [countries, setCountries] = useState<Country[]>(
    countrieCodes as Country[]
  );
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const validatePhoneNumber = (number: string) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, "");
    // Should have 7-15 digits
    return cleaned.length >= 7 && cleaned.length <= 15;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    onChange(selectedCountry.telephoneCode.concat(value));

    if (value && !validatePhoneNumber(value)) {
      setError("Please enter a valid phone number (7-15 digits)");
    } else {
      setError("");
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const handleSearchCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (!searchTerm) {
      setCountries(countrieCodes as Country[]);
      return;
    }
    const filteredCountries = (countrieCodes as Country[]).filter((country) =>
      country.name.toLowerCase().startsWith(searchTerm)
    );
    setCountries(filteredCountries);
  };

  // const handleSubmit = () => {
  //   if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
  //     setError("Please enter a valid phone number");
  //     return;
  //   }

  //   if (onChange) {
  //     // Format the phone number with country code
  //     const formattedPhone = selectedCountry.telephoneCode + phoneNumber.replace(/\D/g, '');
  //     onChange(formattedPhone, selectedCountry.telephoneCode);
  //   }
  // };
  const t = useTranslations();
  return (
    <>
      <div className="relative w-full mx-auto border border-[#FF4ED3] rounded-full">
        <div className="flex items-center rounded-md">
          <div className="relative">
            <button
              type="button"
              className="flex items-start p-2 gap-1"
              onClick={() => setIsOpen(!isOpen)}
              disabled={loading}
            >
              <span
                className={`${selectedCountry.flagClass} w-6 h-4 mr-2`}
              ></span>
              <span>{selectedCountry.code}</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute  z-10 w-64 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg mt-1 text-black"
              >
                <div className="p-0.5 sticky top-0 z-10">
                  <input
                    placeholder="Search country"
                    type="text"
                    onChange={handleSearchCountry}
                    className="bg-gray-100 border-b border-gray-400 p-1 w-full "
                  />
                </div>

                {countries.map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <span
                      className={`${country.flagClass} w-6 h-4 mr-2`}
                    ></span>
                    <span>{country.name}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={t("global.enterPhone")}
            className="flex-1 px-2 py-1 outline-none placeholder:text-sm ltr:placeholder:text-start rtl:placeholder:text-end  "
            disabled={loading}
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </>
  );
};

export default PhoneInput;
