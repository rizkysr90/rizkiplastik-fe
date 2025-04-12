export const formatToRupiah = (amount: number) => {
  const minimumFractionDigits = 0,
    maximumFractionDigits = 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
};

/**
 * Formats a number to Indonesian Rupiah format with dot separator for thousands
 * @param value Number or string to format
 * @returns Formatted string with dot separators
 */
export const formatRupiah = (value: number | string): string => {
  // Handle empty or undefined values
  if (value === undefined || value === null || value === "") {
    return "";
  }

  // If it's a string with formatted dots, convert it to a number first
  const numberValue =
    typeof value === "string" ? parseFloat(value.replace(/\./g, "")) : value;

  if (isNaN(numberValue)) {
    return "";
  }

  // Format with dot as thousand separator
  return numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Extracts the raw number from a formatted Rupiah string
 * @param formattedValue String with dot separators
 * @returns Number without formatting
 */
export const extractNumber = (formattedValue: string): number => {
  // Remove all dots and convert to number
  if (!formattedValue) return 0;

  const rawValue = formattedValue.replace(/\./g, "");
  return rawValue ? parseFloat(rawValue) : 0;
};
