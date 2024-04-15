import { useState } from "react";
import { InfinityScroll } from "./components/InfinityScroll";
import { useInfiniteQuery } from "@tanstack/react-query";

type Data = {
  hits: {
    previewURL: string;
    user: string;
  }[];
};

function App(): JSX.Element {
  const [render, setRender] = useState(true);
  const ITEMS_PER_PAGE = 3;
  const { data, isError, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `https://pixabay.com/api/?key=43104659-01e34685995cc478761143a07&image_type=photo&q=nature&per_page=${ITEMS_PER_PAGE}&page=${pageParam}`
      );

      return (await res.json()) as Data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage?.hits.length === 0) {
        return undefined;
      }

      return lastPageParam + 1;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {render && (
        <InfinityScroll
          isLoading={isFetching}
          isError={isError}
          loader={<h4>Loading...</h4>}
          error={<h4>Error!</h4>}
          scrollBehavior="smooth"
          loadMore={fetchNextPage}
          scrollThreshold={0}
          scrollBy={window.innerHeight}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            rowGap: "10px",
          }}
        >
          <>
            {data?.pages.map((page) =>
              page?.hits?.map((item, key) => (
                <div key={key}>
                  <img src={item.previewURL} alt={item.user} />
                  <p>{item.user}</p>
                </div>
              ))
            )}
          </>
        </InfinityScroll>
      )}
      <button onClick={() => setRender((prev) => !prev)} className="btn">
        BUTTON
      </button>
    </>
  );
}

export default App;

/* import { InfinityScroll } from "./components/InfinityScroll";
import { useGetItems } from "./api";
import { useCallback, useState } from "react";

type Data = {
  hits: {
    previewURL: string;
    user: string;
  }[];
};

function App(): JSX.Element {
  const [perPage, setPerPage] = useState(4);
  const [render, setRender] = useState(true);
  const { data, isError, isPending, refetch } = useGetItems<Data>(
    `https://pixabay.com/api/?key=43104659-01e34685995cc478761143a07&image_type=photo&q=nature&per_page=${perPage}&page=1`
  );

  const loadMore = useCallback(
    async (length: number) => {
      setPerPage((prev) => prev + length);
      await refetch();
    },
    [refetch]
  );

  const handleClick = () => {
    console.log("asdfasdf");
    setRender(false);
  };

  return (
    <>
      {render && (
        <InfinityScroll
          isLoading={isPending}
          isError={isError}
          loader={<h4>Loading...</h4>}
          error={<h4>Error!</h4>}
          typeScroll="smooth"
          loadMore={loadMore}
          scrollThreshold={0}
          dataLength={4}
          scrollBy={window.innerHeight}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            rowGap: "10px",
          }}
        >
          {data?.hits?.map((item, key) => (
            <div key={key}>
              <img src={item.previewURL} alt={item.user} />
              <p>{item.user}</p>
            </div>
          ))}
        </InfinityScroll>
      )}
      <button onClick={handleClick}>HIDE</button>
    </>
  );
}

export default App;
 */
