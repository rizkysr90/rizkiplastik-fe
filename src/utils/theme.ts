// Theme utility file for consistent styling

// Color palette mapping
export const colors = {
  // Primary
  primary: {
    light: "text-primary-500 bg-primary-50",
    default: "text-white bg-primary-500",
    dark: "text-white bg-primary-700",
  },

  // Secondary
  secondary: {
    light: "text-secondary-500 bg-secondary-50",
    default: "text-white bg-secondary-500",
    dark: "text-white bg-secondary-700",
  },

  // Status colors
  success: {
    light: "text-success-700 bg-success-100",
    default: "text-white bg-success-500",
    dark: "text-white bg-success-700",
  },

  warning: {
    light: "text-warning-700 bg-warning-100",
    default: "text-white bg-warning-500",
    dark: "text-white bg-warning-700",
  },

  error: {
    light: "text-error-700 bg-error-100",
    default: "text-white bg-error-500",
    dark: "text-white bg-error-700",
  },
};

// Common component theme combinations
export const componentThemes = {
  // Button variants
  button: {
    primary: `bg-primary-600 hover:bg-primary-700 text-white`,
    secondary: `bg-secondary-500 hover:bg-secondary-600 text-white`,
    outline: `border border-primary-500 text-primary-500 hover:bg-primary-50`,
    danger: `bg-error-500 hover:bg-error-600 text-white`,
  },

  // Card variants
  card: {
    default: `bg-white border border-secondary-200 shadow-sm rounded-lg`,
    flat: `bg-surface-light rounded-lg`,
    elevated: `bg-white shadow-md rounded-lg`,
  },

  // Dashboard component themes
  dashboard: {
    sidebar: `bg-secondary-800 text-white`,
    header: `bg-white border-b border-secondary-200`,
    content: `bg-secondary-50`,
  },
};

// Example function to get appropriate theme
export const getTheme = (
  component: keyof typeof componentThemes,
  variant: string
) => {
  return (
    componentThemes[component]?.[
      variant as keyof (typeof componentThemes)[typeof component]
    ] || ""
  );
};
