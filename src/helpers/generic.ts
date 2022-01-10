
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const fullDateToYear = (data: string) => {
  return new Date(data).getFullYear();
};

export const slugify = (text: string | null | undefined): string | null => {
  if (!text) return null;
  const slugify = require("slugify");
  text = text.replace('/', '-');
  return slugify(text, { lower: true, remove: /[*+~.()'"!:@]/g });
};

export const formatMinutes = (min: number): string => {
  const hours = Math.trunc(min / 60);
  const minutes = min % 60;
  if (hours === 0) {
    return `${minutes}m`;
  } else if (hours !== 0 && minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};
