import { useState } from "react";
import { createApiService } from "./axios";

interface UsePutRequestProps<T> {
  url: string;
  data: T;
  config?: object;
}

interface ApiResponse<R> {
  response: R | null;
  loading: boolean;
  error: Error | null;
  putRequest: () => Promise<void>;
}

const usePutRequest = <T, R>({
  url,
  data,
  config,
}: UsePutRequestProps<T>): ApiResponse<R> => {
  const [response, setResponse] = useState<R | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const putRequest = async () => {
    setLoading(true);
    setError(null);
    const apiService = createApiService();
    try {
      const result = await apiService.put<R>(url, data, config);
      setResponse(result.data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, putRequest };
};

export default usePutRequest;
