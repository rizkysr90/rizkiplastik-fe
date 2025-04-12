interface ProductTextInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

const ProductTextInput: React.FC<ProductTextInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  maxLength,
  required = false,
  placeholder = "",
  helperText,
  error,
  className = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label}
        {required && "*"}
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        maxLength={maxLength}
        required={required}
        placeholder={placeholder}
      />
      {error ? (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      ) : maxLength ? (
        <p className="text-sm text-gray-500 mt-1">
          Maximum {maxLength} characters
        </p>
      ) : null}
    </div>
  );
};

export default ProductTextInput;
