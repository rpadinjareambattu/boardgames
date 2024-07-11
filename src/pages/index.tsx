import { createApiService } from "@/service/axios";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

interface GameList {
  data: [
    {
      id: number;
      attributes: {
        name: string;
        isActive: boolean;
      };
    }
  ];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const apiService = createApiService();

  try {
    const response = await apiService.get<GameList>("v3tournament");
    const data = response.data;

    // Find the first item where isActive is true
    const activeItem = data.data.find((item) => item.attributes.isActive);

    if (activeItem) {
      // Redirect to a page with the ID of the active item
      return {
        redirect: {
          destination: `/${activeItem.id}?tab=matches`,
          permanent: false,
        },
      };
    }
    if (!activeItem) {
      // Redirect to a page with the ID of the active item
      return {
        redirect: {
          destination: `/tournaments`,
          permanent: false,
        },
      };
    }

    // If no active item is found, you can return the data as props
    return { props: { data } };
  } catch (error: any) {
    console.error("Failed to fetch data:", error.message);
    return {
      notFound: true,
    };
  }
};

export default function Page({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <p>Welcome to Shraddha games</p>
    </main>
  );
}
