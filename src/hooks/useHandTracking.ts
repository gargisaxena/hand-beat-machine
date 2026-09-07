import { useCallback, useEffect, useRef, useState } from "react";
import { classifyGesture, GestureStabilizer } from "@/lib/gesture";
import type { Move } from "@/lib/rps";

export type CameraStatus = "idle" | "loading" | "ready" | "denied" | "error";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export function useHandTracking(active: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const landmarkerRef = useRef<{ detectForVideo: (v: HTMLVideoElement, t: number) => any; close: () => void } | null>(
    null,
  );
  const stabilizerRef = useRef(new GestureStabilizer());
  const liveMoveRef = useRef<Move | null>(null);

  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handVisible, setHandVisible] = useState(false);
  const [liveMove, setLiveMove] = useState<Move | null>(null);

  const getCurrentMove = useCallback(() => liveMoveRef.current, []);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    const start = async () => {
      setStatus("loading");
      setErrorMessage(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }

        const vision = await import("@mediapipe/tasks-vision");
        const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);
        const landmarker = await vision.HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          numHands: 1,
          runningMode: "VIDEO",
        });
        if (cancelled) {
          landmarker.close();
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        landmarkerRef.current = landmarker as unknown as typeof landmarkerRef.current;
        setStatus("ready");

        let lastTime = -1;
        const loop = () => {
          rafRef.current = requestAnimationFrame(loop);
          const v = videoRef.current;
          const lmk = landmarkerRef.current;
          if (!v || !lmk || v.readyState < 2) return;
          if (v.currentTime === lastTime) return;
          lastTime = v.currentTime;
          try {
            const result = lmk.detectForVideo(v, performance.now());
            const hand = result?.landmarks?.[0];
            const detected = Boolean(hand);
            setHandVisible((prev) => (prev === detected ? prev : detected));
            const raw = hand ? classifyGesture(hand) : null;
            const stable = stabilizerRef.current.push(raw);
            liveMoveRef.current = stable;
            setLiveMove((prev) => (prev === stable ? prev : stable));
          } catch {
            /* frame skipped */
          }
        };
        loop();
      } catch (err) {
        if (cancelled) return;
        const name = (err as DOMException)?.name;
        if (name === "NotAllowedError" || name === "SecurityError") {
          setStatus("denied");
          setErrorMessage("Camera access was blocked. Allow the camera in your browser to play.");
        } else {
          setStatus("error");
          setErrorMessage(
            name === "NotFoundError"
              ? "No camera found on this device."
              : "The camera or hand tracking could not start.",
          );
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const v = videoRef.current;
      if (v) v.srcObject = null;
      stabilizerRef.current.reset();
      liveMoveRef.current = null;
      setStatus("idle");
      setHandVisible(false);
      setLiveMove(null);
    };
  }, [active]);

  return { videoRef, status, errorMessage, handVisible, liveMove, getCurrentMove };
}
