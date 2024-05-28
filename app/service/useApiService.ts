import { useState, useEffect } from "react";
import axios, { AxiosInstance } from "axios";

interface ApiResponse<T> {
  data: T;
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
        Authorization: `Bearer ffbcbc7b9b6ba6532fda4b27c2bc4736415f7debfd57edbc598f74435f19557e273e943051b8483ee61986a77632551b0e04e874a4e4142caf25c1a8c5838969748852a7eaa980ccc981d3911c38d4c81fcab91ef6a6e63c21f93fc7fb8f02dcec20652d25053e9e186671cbafb3abcfd089b62a55fc295498bf5d4f4aea4e22`,
      },
    });

    const fetchData = async () => {
      try {
        const response = await apiService.get<T>(url);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useApiService;
