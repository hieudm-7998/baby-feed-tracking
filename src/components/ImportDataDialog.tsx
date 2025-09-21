'use client';

import { useState, useEffect } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function ImportDataDialog() {
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState<string | null>(null);
  const [constraints, setConstraints] = useState<MediaTrackConstraints>({
    facingMode: { exact: 'environment' },
  });

  useEffect(() => {
    // Test xem browser có support environment không
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: { exact: 'environment' } } })
      .catch(() => {
        // Nếu fail thì fallback sang camera trước
        setConstraints({ facingMode: 'user' });
      });
  }, []);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes.length) return;

    try {
      const raw = detectedCodes[0].rawValue; // QR chứa JSON
      const parsed = JSON.parse(raw);

      // Lưu thay thế hẳn data cũ
      if (parsed['milk-pump-storage']) {
        localStorage.setItem(
          'milk-pump-storage',
          JSON.stringify(parsed['milk-pump-storage'])
        );
      }
      if (parsed['baby-feed-storage']) {
        localStorage.setItem(
          'baby-feed-storage',
          JSON.stringify(parsed['baby-feed-storage'])
        );
      }

      setScanned('Import thành công ✅');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('QR không hợp lệ hoặc JSON parse lỗi ❌');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          📥 Nhập dữ liệu
        </Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col items-center space-y-4'>
        <DialogHeader>
          <DialogTitle>Nhập dữ liệu</DialogTitle>
          <DialogDescription>
            Quét QR để nhập data vào thiết bị hiện tại.
          </DialogDescription>
        </DialogHeader>

        <Scanner
          onScan={handleScan}
          onError={(err) => setError(String(err))}
          formats={['qr_code']}
          styles={{
            container: { width: '100%' },
            video: { borderRadius: '0.5rem' },
          }}
          constraints={constraints}
        />

        {scanned && <p className='text-green-600 mt-2'>{scanned}</p>}
        {error && <p className='text-red-600 mt-2'>{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
