import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import {
  SupportedModels,
  createDetector,
  HandDetector,
} from "@tensorflow-models/hand-pose-detection";

export class HandRecognition {
  #videoElement: HTMLVideoElement;

  public get videoElement() {
    return this.#videoElement;
  }

  private mediaStream: MediaStream | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private detector: HandDetector | undefined;
  private isTerminated: boolean = false;

  constructor(
    videoElement: HTMLVideoElement,
    private onScroll: (isDown: boolean) => void
  ) {
    this.#videoElement = videoElement;
  }

  public cleanup = () => {
    this.isTerminated = true;
    console.log("Is terminated in clearFunction", this.isTerminated);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log("Cleared interval", this.intervalId);
    }

    if (this.detector) {
      this.detector.dispose();
      console.log("Detector dispose", this.detector);
    }

    if (!this.mediaStream) return;
    const tracks = this.mediaStream.getTracks();
    tracks.forEach((track) => track.stop());
    console.log("Media stream cleared", this.mediaStream);
  };

  private setupMediaStream = async () => {
    try {
      console.log(">>> request media stream");
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      console.log(">>> done request media stream");

      const currentVideo = this.#videoElement;

      console.log("Is terminated in getMediaStream 1", this.isTerminated);

      if (this.isTerminated || !currentVideo) {
        console.log(">>> unmounted");
        this.cleanup();
        return;
      }

      console.log("Is terminated in getMediaStream 2", this.isTerminated);

      currentVideo.srcObject = this.mediaStream;

      currentVideo.onloadedmetadata = async () => {
        await currentVideo?.play();
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  private setupInterval = async () => {
    try {
      console.log(">>> start loading model");

      const model = SupportedModels.MediaPipeHands;

      this.detector = await createDetector(model, {
        runtime: "tfjs",
        modelType: "full",
        maxHands: 1,
      });

      const videoElement = this.#videoElement;

      console.log("Is terminated in setupInterval 1", this.isTerminated);

      if (this.isTerminated || !videoElement) {
        this.cleanup();
        return;
      }

      console.log("Is terminated in setupInterval 2", this.isTerminated);

      const constDetector = this.detector;

      this.intervalId = setInterval(() => {
        this.handDetection(constDetector, videoElement, this.onScroll).catch(
          (error: Error) => {
            console.error("Error handling hand detection:", error);
          }
        );
      }, 200);

      console.log(">>> created interval", this.intervalId);
    } catch (error) {
      console.error("Error loading hand model:", error);
    }
  };

  public init = async () => {
    await this.setupMediaStream();
    await this.setupInterval();
  };

  private handDetection = async (
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
}
