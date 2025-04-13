// Utility function to format date
export const formatDate = (dateString: string): string => {
  console.log("HERE", dateString);
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
