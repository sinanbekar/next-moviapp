import type {
  parseMediaDetailsData,
  parseMediaSingleItemData,
} from "@/utils/index";

export type MediaDetailsData = ReturnType<typeof parseMediaDetailsData>;
export type MediaSingleItemData = ReturnType<typeof parseMediaSingleItemData>;
