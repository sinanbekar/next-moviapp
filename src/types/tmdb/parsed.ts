import type {
  parseMediaDetailsData,
  parseMediaSingleItemData,
  prepareMediaListData,
} from "@/lib/media-parser";

export type MediaDetailsData = ReturnType<typeof parseMediaDetailsData>;
export type MediaSingleItemData = ReturnType<typeof parseMediaSingleItemData>;
export type MediaListingInitialData = ReturnType<typeof prepareMediaListData>;
