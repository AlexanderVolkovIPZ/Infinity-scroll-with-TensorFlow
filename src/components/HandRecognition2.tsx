import { useRef, useEffect } from "react";
import { HandRecognition } from "../classes/HandRecognition";
type HandRecognitionType = {
  onScroll: (isDown: boolean) => void;
};

export function HandRecognitionComponent({ onScroll }: HandRecognitionType) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const onScrollRef = useRef(onScroll);
  onScrollRef.current = onScroll;

  useEffect(() => {
    if (!videoRef.current) return;

    const handRecognition = new HandRecognition(
      videoRef.current,
      (isDown: boolean) => onScrollRef.current(isDown)
    );

    void handRecognition.init();

    return () => handRecognition.cleanup();
  }, []);

  return (
    <video
      style={{ position: "absolute", top: -70, visibility: "hidden" }}
      ref={videoRef}
      autoPlay
      height={400}
      width={400}
      playsInline
    />
  );
}
