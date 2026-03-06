import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function setupCamera() {
      try {
        setIsInitializing(true);
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setError(null);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access camera. Please ensure you have granted permission.');
      } finally {
        setIsInitializing(false);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const confirm = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-2xl aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Camera className="w-5 h-5 text-accent" />
            Property Capture
          </h3>
          <button 
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="w-full h-full relative">
          {isInitializing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="w-10 h-10 text-accent animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Initializing Lens...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center gap-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="text-white font-bold">{error}</p>
              <button 
                onClick={onClose}
                className="btn-secondary mt-4"
              >
                Go Back
              </button>
            </div>
          )}

          {!capturedImage ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          )}

          {/* Guidelines Overlay */}
          {!capturedImage && !error && !isInitializing && (
            <div className="absolute inset-0 pointer-events-none border-[2px] border-white/20 border-dashed m-12 rounded-2xl flex items-center justify-center">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Align Property within Frame</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center gap-8 bg-gradient-to-t from-black/50 to-transparent z-10">
          {!capturedImage ? (
            <button 
              onClick={takePhoto}
              disabled={isInitializing || !!error}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-[6px] border-white/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <div className="w-14 h-14 bg-white rounded-full border-2 border-slate-200"></div>
            </button>
          ) : (
            <div className="flex gap-6">
              <button 
                onClick={retake}
                className="w-16 h-16 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-all"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
              <button 
                onClick={confirm}
                className="w-16 h-16 bg-accent text-background rounded-full flex items-center justify-center hover:opacity-90 transition-all"
              >
                <Check className="w-8 h-8" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <p className="mt-6 text-slate-500 text-xs font-medium uppercase tracking-widest">
        GPS Verification Active • Surveyor ID #842
      </p>
    </div>
  );
}
