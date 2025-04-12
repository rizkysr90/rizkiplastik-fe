import React from "react";

interface PercentageInputProps {
  id: string;
  name: string;
  label: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

const PercentageInput: React.FC<PercentageInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  min = 0,
  max = 100,
  step = "0.1",
  error,
  helperText,
  className = "",
}) => {
  return (
    <div className={`${className}`}>
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label}
        {required && "*"}
      </label>
      <div className="relative">
        <input
          type="number"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pr-8 pl-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          step={step}
          min={min}
          max={max}
          required={required}
        />
        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
          %
        </span>
      </div>
      {error ? (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default PercentageInput;
