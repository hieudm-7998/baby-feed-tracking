'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function ExportDataDialog() {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    const milkPump = localStorage.getItem('milk-pump-storage');
    const babyFeed = localStorage.getItem('baby-feed-storage');

    const payload = {
      milkPump: milkPump ? JSON.parse(milkPump) : null,
      babyFeed: babyFeed ? JSON.parse(babyFeed) : null,
    };

    const jsonString = JSON.stringify(payload);

    QRCode.toDataURL(jsonString, { errorCorrectionLevel: 'M' })
      .then((url) => setQr(url))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          📤 Xuất dữ liệu
        </Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col items-center space-y-4'>
        <DialogHeader>
          <DialogTitle>Xuất dữ liệu</DialogTitle>
          <DialogDescription>
            Quét QR này để nhập data vào thiết bị mới.
          </DialogDescription>
        </DialogHeader>
        {qr ? (
          <img src={qr} alt='QR Export Data' className='w-64 h-64' />
        ) : (
          <p>Đang tạo QR...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
