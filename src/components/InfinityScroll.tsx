import { useRef, useEffect } from "react";
import { HandRecognitionComponent } from "./HandRecognition2";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

type InfinityScrollProps = {
  children: JSX.Element[] | JSX.Element | undefined;
  loadMore: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<unknown, unknown>, Error>
  >;
  scrollBehavior?: "auto" | "smooth" | "instant";
  isLoading: boolean;
  isError: boolean;
  loader?: string | JSX.Element;
  error?: string | JSX.Element;
  scrollThreshold?: number | number[];
  scrollBy?: number;
  style?: React.CSSProperties;
};

export function InfinityScroll({
  children,
  loadMore,
  isLoading,
  scrollBehavior = "auto",
  scrollThreshold = 0,
  scrollBy = 100,
  style,
}: InfinityScrollProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          void loadMore();
        }
      },
      { threshold: scrollThreshold }
    );

    const ref = triggerRef.current;
    observer.observe(ref);

    return () => {
      observer.unobserve(ref);
    };
  }, [isLoading, loadMore, scrollThreshold]);

  const onScroll = (isScrollDown: boolean) => {
    if (isScrollDown) {
      window.scrollBy({
        top: scrollBy,
        left: 0,
        behavior: scrollBehavior,
      });
    } else {
      window.scrollBy({
        top: -scrollBy,
        left: 0,
        behavior: scrollBehavior,
      });
    }
  };

  return (
    <div className="container">
      <div className="video">
        <HandRecognitionComponent onScroll={onScroll} />
      </div>
      <div style={style}>
        {children}
        <div id="trigger" ref={triggerRef} style={{ height: "10px" }}></div>
      </div>
    </div>
  );
}
