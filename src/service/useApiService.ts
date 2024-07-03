import useSWR from "swr";
import axios, { AxiosInstance } from "axios";
import { createApiService } from "./axios";

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const fetcher = (url: string, apiService: AxiosInstance) =>
  apiService.get(url).then((res) => res.data);

export const useApiService = <T>(
  url: string,
  shouldFetch: boolean = true
): ApiResponse<T> => {
  const apiService = createApiService();
  const { data, error } = useSWR(shouldFetch ? url : null, (url) =>
    fetcher(url, apiService)
  );

  return {
    data: data as T,
    loading: !data && !error,
    error: error as Error,
  };
};

export default useApiService;
