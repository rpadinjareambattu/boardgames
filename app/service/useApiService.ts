import { useState, useEffect } from "react";
import axios, { AxiosInstance } from "axios";

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const useApiService = <T>(url: string): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const token = process.env.REACT_APP_BEARER_TOKEN;

    const apiService: AxiosInstance = axios.create({
      baseURL: "https://otboardgames.azurewebsites.net/api/",
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 1c4950efa852253316960fdadff2aaf31da0a4faf7199fb9dd26b205dfc0d1dd961fdf63ccde28cea534bda4af87cc3d8ce0e3387ae8ba02270b39f287177026138cc6b213a9fa1cea91f4901d88f0b9d07bbbedac49749232276ae3a1db15dbe132b774106b7c3e44eb028384cbf060eb4b7c3f6836bb1a03cfa09bc293a7cf`,
      },
    });

    const fetchData = async () => {
      try {
        const response = await apiService.get<T>(url);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useApiService;
