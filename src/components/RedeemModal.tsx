import { useState } from 'react';
import { X, QrCode, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    item_name: string;
    item_image: string;
    item_description: string;
  };
  onMarkAsUsed: (id: string) => Promise<void>;
}

const RedeemModal = ({ isOpen, onClose, item, onMarkAsUsed }: RedeemModalProps) => {
  const [isMarking, setIsMarking] = useState(false);
  const [isUsed, setIsUsed] = useState(false);

  if (!isOpen) return null;

  const handleMarkAsUsed = async () => {
    setIsMarking(true);
    await onMarkAsUsed(item.id);
    setIsUsed(true);
    setIsMarking(false);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Generate a unique redemption code for the QR
  const redemptionCode = `NP-REWARD-${item.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const qrValue = JSON.stringify({
    type: 'np_timewave_redemption',
    itemId: item.id,
    itemName: item.item_name,
    code: redemptionCode,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-card rounded-2xl max-w-sm w-full overflow-hidden border border-border animate-scale-in">
        {/* Header */}
        <div className="bg-primary/10 p-4 flex items-center justify-between border-b border-border">
          <h2 className="font-display text-lg font-bold text-foreground">Redeem Voucher</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Item Info */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-3xl">
              {item.item_image}
            </div>
            <div className="text-left">
              <h3 className="font-display font-bold text-foreground">{item.item_name}</h3>
              <p className="text-muted-foreground text-sm">{item.item_description}</p>
            </div>
          </div>

          {/* QR Code */}
          {!isUsed ? (
            <>
              <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-lg">
                <QRCodeSVG 
                  value={qrValue}
                  size={160}
                  level="M"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#1a1a1a"
                />
              </div>
              <p className="text-xs text-muted-foreground mb-2 font-mono">{redemptionCode}</p>

              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-6">
                <QrCode className="w-4 h-4" />
                <span>Show this to staff for verification</span>
              </div>

              <button
                onClick={handleMarkAsUsed}
                disabled={isMarking}
                className="w-full py-3 bg-success text-white font-semibold rounded-xl hover:bg-success/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isMarking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Mark as Used
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="py-8">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <Check className="w-10 h-10 text-success" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Voucher Used!</h3>
              <p className="text-muted-foreground">Thank you for your redemption.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedeemModal;