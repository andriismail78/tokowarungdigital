import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef } from "react";

const BarcodeScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const scannedRef = useRef(false); // ⬅️ PENTING

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    reader.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result) => {
        if (result && !scannedRef.current) {
          scannedRef.current = true; // cegah double scan
          onScan(result.getText());
          onClose(); // ⬅️ cukup tutup component
        }
      }
    );

    return () => {
      readerRef.current?.stopContinuousDecode?.();
      readerRef.current = null;
    };
  }, []);

  return (
    <div style={styles.overlay}>
      <video
        ref={videoRef}
        style={styles.video}
        autoPlay
        playsInline
        muted
      />
      <button onClick={onClose} style={styles.closeBtn}>✕</button>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "black",
    zIndex: 9999,
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    fontSize: 24,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "50%",
  },
};

export default BarcodeScanner;
