import type {
  parseMediaDetailsData,
  parseMediaSingleItemData,
  prepareMediaListData,
} from "@/utils/index";

export type MediaDetailsData = ReturnType<typeof parseMediaDetailsData>;
export type MediaSingleItemData = ReturnType<typeof parseMediaSingleItemData>;
export type MediaListingInitialData = ReturnType<typeof prepareMediaListData>;
