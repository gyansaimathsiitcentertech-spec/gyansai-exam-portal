import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Share2, X, Copy, Check, MessageSquare, Mail, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

export const ShareExamModal: React.FC = () => {
  const {
    activeExamIdForShare,
    setActiveExamIdForShare,
    exams,
    showToast
  } = usePortal();

  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const currentExam = exams.find(e => e.id === activeExamIdForShare) || exams[0];

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/exam/${currentExam?.id || 'b9675672-2d0b-4256-a995-1df55b3e2189'}`
    : `https://iit-test-portal.preview.emergentagent.com/exam/${currentExam?.id}`;

  useEffect(() => {
    if (shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('QR code error:', err));
    }
  }, [shareUrl]);

  if (!activeExamIdForShare || !currentExam) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Exam URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Take ${currentExam.title} at Gyansai Maths IIT Center: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Exam Invitation: ${currentExam.title}`);
    const body = encodeURIComponent(`Please join the exam at: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header - Exact Screenshot 487 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-900 font-bold text-sm">
            <Share2 className="w-4 h-4 text-blue-700" />
            <span>Share Exam</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveExamIdForShare(null)}
            className="text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body - Exact Screenshot 487 */}
        <div className="p-6 space-y-4 font-sans text-xs">
          <div className="font-bold text-base text-gray-950">
            {currentExam.title}
          </div>

          {/* URL Input */}
          <div className="p-2.5 bg-gray-50 border border-gray-200 rounded font-mono text-[11px] text-gray-700 break-all select-all">
            {shareUrl}
          </div>

          {/* 2x2 Buttons Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium rounded flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-600" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium rounded flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleEmail}
              className="py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium rounded flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-gray-600" />
              <span>Email</span>
            </button>

            <button
              type="button"
              className="py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium rounded flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5 text-gray-600" />
              <span>QR Code</span>
            </button>
          </div>

          {/* QR Code Graphic Display */}
          <div className="pt-2 flex justify-center">
            <div className="p-3 bg-white border border-gray-200 rounded">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Exam QR Code" className="w-48 h-48 object-contain" />
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  Loading QR...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
