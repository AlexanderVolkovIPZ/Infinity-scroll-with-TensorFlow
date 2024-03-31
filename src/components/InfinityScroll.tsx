import { useEffect, useRef, useState } from "react";
import { useFetchData } from "../api";
import DataList from "./DataList";

/* interface Data {
  hits: { userImageURL: string }[];
} */

/* interface Data {
  title: string;
} */

interface Data {
  hits: {
    userImageURL: string;
    user: string;
  }[];
}

export default function InfinityScroll() {
  const [perPage, setPerPage] = useState(10);
  const triggerRef = useRef(null);
  const { isLoading, error, data, refetch } = useFetchData<Data>(
    `https://pixabay.com/api/?key=43104659-01e34685995cc478761143a07&image_type=photo&q=nature&per_page=${perPage}&page=1`
  );
  /*   const { isLoading, error, data, refetch } = useFetchData<Data[]>(
    `https://jsonplaceholder.typicode.com/todos?_limit=${perPage}`
  );
 */
  useEffect(() => {
    if (!triggerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setPerPage((prev) => prev + 5);
        }
      },
      { threshold: 0 }
    );

    const ref = triggerRef.current;
    observer.observe(ref);

    return () => {
      observer.unobserve(ref);
    };
  }, [isLoading]);

  useEffect(() => {
    async function refetchData() {
      await refetch();
    }
    refetchData().catch(() => {
      console.log("Happen some error!");
    });
  }, [perPage, refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred error!</div>;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        rowGap: "10px",
      }}
    >
      <DataList
        /*         items={data?.hits?.map((item)=>({
          url: item?.userImageURL,
        }))}
        */
        /*         items={data?.map((item) => ({
          text: item.title,
        }))} */

        items={data?.hits?.map((item) => ({
          url: item?.userImageURL,
          text: item?.user,
        }))}
      />
      <div id="trigger" ref={triggerRef} style={{ height: "10px" }}></div>
    </div>
  );
}
