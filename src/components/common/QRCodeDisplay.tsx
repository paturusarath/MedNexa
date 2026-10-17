import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Download, QrCode as QrIcon } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  title?: string;
  subtext?: string;
  showCopy?: boolean;
  copyLabel?: string;
  accentColor?: string;
  className?: string;
  downloadFileName?: string;
  showDownloadImage?: boolean;
  hideDetails?: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  title,
  subtext,
  showCopy = true,
  copyLabel = 'Copy Link',
  accentColor = '#0f766e',
  className = '',
  downloadFileName = 'MedNexa_QR_Code.png',
  showDownloadImage = false,
  hideDetails = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#09152b',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (error) => {
        if (error) {
          console.error('Failed to generate QR code:', error);
        } else if (canvasRef.current) {
          try {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            setQrDataUrl(dataUrl);
          } catch (e) {
            // ignore canvas security warnings
          }
        }
      }
    );
  }, [value, size]);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = downloadFileName;
    link.click();
  };

  if (hideDetails) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="rounded-lg max-w-full h-auto"
        />
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-3 ${className}`}
    >
      {title && (
        <div className="space-y-0.5">
          <h4 className="text-sm font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
            <QrIcon className="w-4 h-4 text-teal-600" />
            <span>{title}</span>
          </h4>
          {subtext && <p className="text-[11px] text-slate-500 font-medium">{subtext}</p>}
        </div>
      )}

      {/* QR Code Canvas Frame */}
      <div className="relative p-2.5 rounded-2xl bg-slate-50 border-2 border-teal-500/20 shadow-inner flex items-center justify-center group">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="rounded-xl shadow-xs max-w-full h-auto"
        />
        {/* Subtle decorative scan overlay line */}
        <div className="absolute inset-x-4 top-2 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-60 pointer-events-none animate-pulse" />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full">
        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="Copy encoded value or UPI string"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{copyLabel}</span>
              </>
            )}
          </button>
        )}

        {showDownloadImage && qrDataUrl && (
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="Download QR code image as PNG picture"
          >
            <Download className="w-3.5 h-3.5 text-teal-700" />
            <span>Save QR Picture</span>
          </button>
        )}
      </div>
    </div>
  );
};
