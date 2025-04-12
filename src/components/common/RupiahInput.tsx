// src/components/common/RupiahInput.tsx

import React, { useEffect, useState } from "react";
import { extractNumber, formatRupiah } from "../../utils/number";

interface RupiahInputProps {
  value: number;
  onChange: (e: { target: { name: string; value: number } }) => void;
  name: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const RupiahInput: React.FC<RupiahInputProps> = ({
  value,
  onChange,
  name,
  placeholder = "",
  required = false,
  className = "",
}) => {
  // Internal state for the formatted display value
  const [displayValue, setDisplayValue] = useState<string>(formatRupiah(value));

  // Update display value when prop value changes
  useEffect(() => {
    setDisplayValue(formatRupiah(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;

    // Remove any non-digit characters
    const sanitizedInput = rawInput.replace(/[^\d]/g, "");

    if (sanitizedInput === "") {
      setDisplayValue("");
      // Notify parent with 0 for empty input
      onChange({ target: { name, value: 0 } });
      return;
    }

    // Format the sanitized input
    const formattedValue = formatRupiah(sanitizedInput);
    setDisplayValue(formattedValue);

    // Extract the actual number and notify parent
    const numericValue = extractNumber(formattedValue);
    onChange({ target: { name, value: numericValue } });
  };

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
        Rp
      </span>
      <input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default RupiahInput;
