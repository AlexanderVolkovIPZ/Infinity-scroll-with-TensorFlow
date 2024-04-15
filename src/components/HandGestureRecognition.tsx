/* import * as handPose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";

import { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";

interface IHandGestureRecognition {
  onScroll: (value: boolean) => void;
}

export function HandGestureRecognition({ onScroll }: IHandGestureRecognition) {
  const webcamRef = useRef(null);

  const handDetection = useCallback(
    async (model: handPose.HandPose, webcamRef: React.RefObject<Webcam>) => {
      try {
        const videoElement = webcamRef.current?.video;

        if (!videoElement) return;
        const predictions = await model.estimateHands(videoElement);
        console.log(predictions.length);
        if (predictions.length == 0) return;
        const point0CordY = predictions[0].annotations?.thumb[0][1];
        const point1CordY = predictions[0].annotations?.thumb[1][1];
        const point2CordY = predictions[0].annotations?.thumb[2][1];
        const point3CordY = predictions[0].annotations?.thumb[3][1];

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
    },
    [onScroll]
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const setupInterval = async () => {
      try {
        console.log(345456);
        const model = await handPose.load();

        if (!webcamRef.current || !webcamRef.current["video"] || !model) return;
        intervalId = setInterval(() => {
          handDetection(model, webcamRef).catch((error) => {
            console.error("Помилка при обробці виявлення рук:", error);
          });
        }, 2000);
      } catch (error) {
        console.error("Помилка при завантаженні моделі рук:", error);
      }
    };
    void setupInterval();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [handDetection, webcamRef]);

  return <Webcam ref={webcamRef} className="video" height={300} />;
}
 */