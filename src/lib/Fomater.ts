
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
export const formatRuntime = (mins: number) => {
  if (!mins || mins <= 0) return "N/A";

  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;

  return `${hours}h ${minutes}min`;
};