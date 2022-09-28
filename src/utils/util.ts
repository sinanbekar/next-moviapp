import _slugify from "slugify";
import type { MediaDetailsData } from "./media-parser";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const slugify = (text: string): string =>
  _slugify(text.replace("/", "-"), {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });

export const parseSlugToIdAndTitle = (slug: string) => {
  const id = parseInt(slug.split("-")[0]);
  const title = slug.slice(slug.indexOf("-") + 1);

  return {
    id: slug.includes("-") && !isNaN(id) ? id : 0,
    title: title,
  };
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

export const getYearFormatted = ({
  isEnded,
  year,
  endYear,
}: Pick<MediaDetailsData, "isEnded" | "year" | "endYear">) =>
  String(isEnded && year !== endYear ? `${year} - ${endYear}` : year);

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: any = {};
  keys.forEach((key) => {
    ret[key] = obj[key];
  });
  return ret;
}
