import { useState } from 'react';
import { X, QrCode, Check } from 'lucide-react';

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

  // Generate a mock QR code pattern using CSS
  const generateMockQRPattern = () => {
    const rows = 9;
    const cols = 9;
    const pattern = [];
    
    // Simple deterministic pattern based on item id
    const seed = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        // Corner patterns (fixed)
        if ((i < 3 && j < 3) || (i < 3 && j >= cols - 3) || (i >= rows - 3 && j < 3)) {
          if (i === 0 || i === 2 || j === 0 || j === 2 || 
              (i < 3 && j < 3 && (i === 0 || i === 2 || j === 0 || j === 2)) ||
              (i < 3 && j >= cols - 3 && (i === 0 || i === 2 || j === cols - 1 || j === cols - 3)) ||
              (i >= rows - 3 && j < 3 && (i === rows - 1 || i === rows - 3 || j === 0 || j === 2))) {
            row.push(true);
          } else if (i === 1 && j === 1) {
            row.push(true);
          } else if (i < 3 && j >= cols - 3 && i === 1 && j === cols - 2) {
            row.push(true);
          } else if (i >= rows - 3 && j < 3 && i === rows - 2 && j === 1) {
            row.push(true);
          } else {
            row.push(false);
          }
        } else {
          // Random pattern based on seed
          row.push((seed * (i + 1) * (j + 1)) % 3 === 0);
        }
      }
      pattern.push(row);
    }
    return pattern;
  };

  const qrPattern = generateMockQRPattern();

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
                <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(9, 1fr)` }}>
                  {qrPattern.map((row, i) => 
                    row.map((cell, j) => (
                      <div 
                        key={`${i}-${j}`}
                        className={`w-4 h-4 rounded-sm ${cell ? 'bg-gray-900' : 'bg-white'}`}
                      />
                    ))
                  )}
                </div>
              </div>

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