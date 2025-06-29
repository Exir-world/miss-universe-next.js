import React, { useState } from "react";
import countrieCodes from "./countries.json";
import { motion } from "framer-motion";
import "/node_modules/flag-icons/css/flag-icons.min.css";

interface PhoneInputProps {
  onSubmit?: (phoneNumber: string, countryCode: string) => void;
  loading?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit, loading = false }) => {
  const [countries, setCountries] = useState<any>(countrieCodes);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const validatePhoneNumber = (number: string) => {
    // Basic phone number validation (allows 7-15 digits, optional + at start)
    const phoneRegex = /^\+?\d{7,15}$/;
    return phoneRegex.test(number);
  };

  const handlePhoneChange = (e: any) => {
    const value = e.target.value;
    setPhoneNumber(value);

    if (value && !validatePhoneNumber(value)) {
      setError("Please enter a valid phone number (7-15 digits)");
    } else {
      setError("");
    }
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const handleSearchCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (!searchTerm) {
      setCountries(countrieCodes);
      return;
    }
    const filteredCountries = countrieCodes.filter((country: any) =>
      country.name.toLowerCase().startsWith(searchTerm)
    );
    setCountries(filteredCountries);
  };

  const handleSubmit = () => {
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }
    
    if (onSubmit) {
      onSubmit(phoneNumber, selectedCountry.telephoneCode);
    }
  };

  return (
    <>
      <div className="relative w-full mx-auto border border-[#FF4ED3] rounded-full">
        <div className="flex items-center rounded-md">
          <div className="relative">
            <button
              type="button"
              className="flex items-center px-3 py-2"
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
                className="absolute z-10 w-64 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg mt-1 text-black"
              >
                <div className="p-0.5">
                  <input
                    placeholder="Search country"
                    type="text"
                    onChange={(e) => handleSearchCountry(e)}
                    className="bg-gray-100 border-b border-gray-400 p-1 w-full"
                  />
                </div>

                {countries.map((country: any) => (
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
            placeholder="Enter phone number"
            className="flex-1 px-2 py-1 outline-none"
            disabled={loading}
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      
      <button
        onClick={handleSubmit}
        disabled={loading || !phoneNumber || !!error}
        className="w-full mt-4 bg-[#FF4ED3] text-white py-2 px-4 rounded-full hover:bg-[#FF4ED3]/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Submit"}
      </button>
    </>
  );
};

export default PhoneInput;
