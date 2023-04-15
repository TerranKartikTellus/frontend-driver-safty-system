import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

function WebcamInput({ width, height, onFrame }) {
  const videoRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.loadFaceDetectionModel();
      await faceapi.loadFaceExpressionModel();
      startCapture();
    };
    loadModels();
  }, []);

  const startCapture = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const loop = async () => {
        context.drawImage(videoRef.current, 0, 0, width, height);
        const detections = await faceapi.detectAllFaces(canvas).withFaceExpressions();
        const dataUrl = canvas.toDataURL('image/jpeg');
        onFrame({ dataUrl, detections });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  };

  return <video ref={videoRef} width={width} height={height} />;
}

export default WebcamInput;
