import {
  SupportedModels,
  createDetector,
  HandDetector,
} from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { useRef, useEffect } from "react";

type HandRecognition = {
  onScroll: (isDown: boolean) => void;
};

export function HandRecognition({ onScroll }: HandRecognition) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const onScrollRef = useRef(onScroll);
  onScrollRef.current = onScroll;

  useEffect(() => {
    let mediaStream: MediaStream | null = null;
    let intervalId: NodeJS.Timeout | null = null;
    let detector: HandDetector | undefined;
    let isTerminated = false;

    const cleanup = () => {
      isTerminated = true;
      console.log("Is terminated in clearFunction", isTerminated);
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Cleared interval", intervalId);
      }

      if (detector) {
        detector.dispose();
        console.log("Detector dispose", detector);
      }

      if (!mediaStream) return;
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => track.stop());
      console.log("Media stream cleared", mediaStream);
    };

    const setupMediaStream = async () => {
      try {
        console.log(">>> request media stream");
        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });

        console.log(">>> done request media stream");

        const currentVideo = videoRef.current;

        console.log("Is terminated in getMediaStream 1", isTerminated);

        if (isTerminated || !currentVideo) {
          console.log(">>> unmounted");
          cleanup();
          return;
        }

        console.log("Is terminated in getMediaStream 2", isTerminated);

        currentVideo.srcObject = mediaStream;

        currentVideo.onloadedmetadata = async () => {
          await currentVideo?.play();
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const setupInterval = async () => {
      try {
        console.log(">>> start loading model");

        const model = SupportedModels.MediaPipeHands;

        detector = await createDetector(model, {
          runtime: "tfjs",
          modelType: "full",
          maxHands: 1,
        });

        const videoElement = videoRef.current;

        console.log("Is terminated in setupInterval 1", isTerminated);

        if (isTerminated || !videoElement) {
          cleanup();
          return;
        }

        console.log("Is terminated in setupInterval 2", isTerminated);

        const constDetector = detector;

        intervalId = setInterval(() => {
          handDetection(constDetector, videoElement, onScrollRef.current).catch(
            (error) => {
              console.error("Error handling hand detection:", error);
            }
          );
        }, 1000);

        console.log(">>> created interval", intervalId);
      } catch (error) {
        console.error("Error loading hand model:", error);
      }
    };

    const init = async () => {
      await setupMediaStream();
      await setupInterval();
    };
    void init();

    return cleanup;
  }, []);

  return (
    <video
      style={{ position: "absolute", top: -70 }}
      ref={videoRef}
      autoPlay
      height={400}
      width={400}
      playsInline
    />
  );
}

const handDetection = async (
  detector: HandDetector,
  videoElement: HTMLVideoElement,
  onScroll: (isDown: boolean) => void
) => {
  try {
    const predictions = await detector?.estimateHands(videoElement);
    console.log(predictions);
    if (predictions.length == 0) return;
    const point0CordY = predictions[0].keypoints[0].y;
    const point1CordY = predictions[0].keypoints[1].y;
    const point2CordY = predictions[0].keypoints[2].y;
    const point3CordY = predictions[0].keypoints[3].y;

    if (
      (point0CordY && point1CordY && point0CordY > point1CordY) ||
      (point0CordY && point2CordY && point0CordY > point2CordY) ||
      (point0CordY && point3CordY && point0CordY > point3CordY) ||
      (point1CordY && point2CordY && point1CordY > point2CordY) ||
      (point1CordY && point3CordY && point1CordY > point3CordY) ||
      (point2CordY && point3CordY && point2CordY > point3CordY)
    ) {
      onScroll(false);
    } else {
      onScroll(true);
    }
  } catch (error) {
    console.error(error);
  }
};
