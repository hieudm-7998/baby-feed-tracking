'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMilkPumpStore } from '@/store/MilkPumpStore';
import dayjs from 'dayjs';
import { CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';
import { vi } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function LichMeHutSua() {
  return (
    <div className='flex flex-col space-y-4'>
      <MilkPumpDataTable />
      <MilkPumpForm />
    </div>
  );
}

function MilkPumpForm() {
  const addEntry = useMilkPumpStore((state) => state.addEntry);

  const today = dayjs().format('YYYY-MM-DD');
  const now = dayjs().format('HH:mm');

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(now);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const parsed = dayjs(date, 'YYYY-MM-DD').toDate();

  const handleConfirm = () => {
    if (!amount || !date || !time) return;

    addEntry({
      amount: Number(amount),
      date,
      time,
    });

    setAmount('');
    setDate(today);
    setTime(now);
    setConfirmOpen(false);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className='flex flex-col space-y-4 bg-white shadow p-4 rounded-md'
    >
      <h1 className='font-bold text-center'>Thêm lịch hút sữa</h1>

      {/* Date Picker inline */}
      <div className='flex flex-col space-y-2'>
        <label className='mb-1 text-sm'>Ngày hút sữa</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='justify-between items-center font-normal text-left'
            >
              <div className='flex items-center'>
                <CalendarIcon className='mr-2 w-4 h-4' />
                {date
                  ? dayjs(date).locale('vi').format('DD-MM-YYYY')
                  : 'Chọn ngày'}
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setDate(dayjs().format('YYYY-MM-DD'));
                }}
                className='text-[salmon] text-sm underline cursor-pointer'
              >
                Hôm nay
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0 w-auto' align='start'>
            <Calendar
              mode='single'
              selected={parsed}
              locale={vi}
              onSelect={(val) => {
                if (val) {
                  setDate(dayjs(val).format('YYYY-MM-DD'));
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time picker */}
      <div className='flex flex-col'>
        <label className='mb-1 text-sm'>Giờ hút sữa</label>
        <div className='flex items-center gap-2'>
          <Input
            type='time'
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className='p-2 border rounded-[7px]'
          />
        </div>
      </div>

      {/* Input số ml */}
      <div className='flex flex-col'>
        <label className='mb-1 text-sm'>Số lượng (ml)</label>
        <Input
          type='number'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder='Nhập ml'
          className='p-2 border rounded-[7px]'
        />
      </div>

      {/* Nút Lưu + Dialog xác nhận */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger asChild>
          <Button
            type='button'
            className='bg-[salmon] p-2 rounded text-white'
            disabled={!amount}
          >
            Lưu
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thông tin</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn lưu lịch hút sữa này không? <br />
              <span className='font-medium'>
                Ngày: {dayjs(date).format('DD-MM-YYYY')}
              </span>
              <br />
              <span className='font-medium'>Giờ: {time}</span>
              <br />
              <span className='font-medium'>Số lượng: {amount} ml</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className='bg-[salmon]'>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

function MilkPumpDataTable() {
  const invoices = [
    { id: 'INV001', amount: 120, date: Date.now(), time: '08:30' },
    { id: 'INV002', amount: 150, date: Date.now(), time: '14:15' },
    { id: 'INV003', amount: 100, date: Date.now(), time: '20:00' },
  ];
  return (
    <div className='flex flex-col space-y-4 bg-white shadow p-4 rounded-md'>
      <h1 className='font-bold text-center'>Thống kê hút sữa</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>STT</TableHead>
            <TableHead>Lượng (ml)</TableHead>
            <TableHead>Giờ</TableHead>
            <TableHead className='text-right'>Ngày</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow key={invoice.id}>
              <TableCell className='font-medium'>{index + 1}</TableCell>
              <TableCell>{invoice.amount}</TableCell>
              <TableCell>{invoice.time}</TableCell>
              <TableCell className='text-right'>
                {dayjs(invoice.date).format('DD-MM-YYYY')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className='font-bold'>Tổng</TableCell>
            <TableCell colSpan={3} className='font-bold text-right'>
              2 lần - 370 ml
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
