import Banner from "@/components/banner";
import Header from "@/components/header";
import Matches from "@/components/matches";
import PointsTable from "@/components/pointsTable";
import useApiService from "@/service/useApiService";
import usePutRequest from "@/service/usePutRequest";
import { TournamentData, TournamentToUpdate } from "@/types/tournament";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

const Page = () => {
  const router = useRouter();
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const { tab, tournament } = router.query;

  const { data: tournamentData, loading } = useApiService<TournamentData>(
    `tournaments/${tournament}?populate[media][fields][0]=name&populate[media][fields][1]=url&populate[cover][fields][1]=url&populate[games][fields][0]=id&populate[games][fields][1]=name&populate[activeGame][fields][0]=id`,
    !!tournament
  );
  const { putRequest } = usePutRequest<TournamentToUpdate, TournamentData>({
    url: `tournaments/${tournament}`,
    data: {
      data: {
        views: tournamentData ? +tournamentData.data.attributes.views + 1 : 0,
      },
    },
  });
  useEffect(() => {
    if (tournamentData && !isCalled) {
      putRequest();
      setIsCalled(true);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentData]);

  return (
    <>
      <Header id={tournament ? +tournament : undefined} />
      <Banner
        tournament={!!tournamentData ? tournamentData.data : undefined}
        loading={loading}
      />
      {tab === "matches" && (
        <Matches name={tournamentData?.data.attributes.name || "Tournament"} />
      )}
      {tab === "table" && (
        <PointsTable
          name={tournamentData?.data.attributes.name || "Tournament"}
        />
      )}
    </>
  );
};
export default Page;
