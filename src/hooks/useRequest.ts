import useSWR from "swr";
import { fetcher } from "@/helpers/generic";

interface DataResponse<T> {
  data: T | undefined;
  error: any;
  isLoading: boolean;
}

const useRequest = <T>(url: string | null): DataResponse<T> => {
  const { data, error } = useSWR<T>(url, fetcher);
  return {
    data,
    error,
    isLoading: !data && !error,
  };
};

export default useRequest;
