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
import { useBabyFeedStore } from '@/store/BabyFeedStore';
import dayjs from 'dayjs';
import { CalendarIcon, Trash2 } from 'lucide-react';
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

export default function LichEmAnSua() {
  return (
    <div className='flex flex-col space-y-4'>
      <BabyFeedFilterTable />
      <BabyFeedForm />
    </div>
  );
}

function BabyFeedForm() {
  const addEntry = useBabyFeedStore((state) => state.addEntry);

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
      <h1 className='font-bold text-center'>Thêm lịch em bé uống sữa</h1>

      {/* Date Picker */}
      <div className='flex flex-col space-y-2'>
        <label className='mb-1 text-sm'>Ngày uống sữa</label>
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
        <label className='mb-1 text-sm'>Giờ uống sữa</label>
        <Input
          type='time'
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className='p-2 border rounded-[7px]'
        />
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

      {/* Nút Lưu + Dialog */}
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
            <AlertDialogTitle>Xác nhận</AlertDialogTitle>
            <AlertDialogDescription>
              <span className='mb-5 block'>Lưu lịch uống sữa này không?</span>
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
            <AlertDialogCancel>Đừng</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className='bg-[salmon]'>
              Ô cê !
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

function BabyFeedFilterTable() {
  const entries = useBabyFeedStore((s) => s.entries);

  const [open, setOpen] = useState(false);
  const [filterDate, setFilterDate] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  );

  const parsed = filterDate
    ? dayjs(filterDate, 'YYYY-MM-DD').toDate()
    : undefined;

  const filteredEntries = filterDate
    ? entries.filter((e) => e.date === filterDate)
    : entries;

  const sortedEntries = [...filteredEntries].sort((a, b) =>
    dayjs(a.time, 'HH:mm').diff(dayjs(b.time, 'HH:mm'))
  );

  return (
    <div className='flex flex-col space-y-4 bg-white shadow p-4 rounded-md'>
      <h1 className='font-bold text-center'>Thống kê em bé uống sữa</h1>
      <div className='flex justify-between items-center'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='flex items-center gap-2 text-sm'
            >
              <CalendarIcon className='w-4 h-4' />
              {filterDate
                ? dayjs(filterDate).format('DD-MM-YYYY')
                : 'Chọn ngày'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0 w-auto' align='end'>
            <Calendar
              mode='single'
              selected={parsed}
              locale={vi}
              onSelect={(val) => {
                if (val) {
                  setFilterDate(dayjs(val).format('YYYY-MM-DD'));
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
        <span
          className='text-[salmon] text-sm underline cursor-pointer'
          onClick={() => {
            const today = dayjs().format('YYYY-MM-DD');
            setFilterDate(today);
          }}
        >
          Hôm nay
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>STT</TableHead>
            <TableHead>Lượng (ml)</TableHead>
            <TableHead>Giờ</TableHead>
            <TableHead className='text-right'>Ngày</TableHead>
            <TableHead className='text-center'>Xóa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.amount}</TableCell>
                <TableCell>{entry.time}</TableCell>
                <TableCell className='text-right'>
                  {dayjs(entry.date).format('DD-MM-YYYY')}
                </TableCell>
                <TableCell className='text-center'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-[salmon]'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xóa lịch uống sữa</AlertDialogTitle>
                        <AlertDialogDescription>
                          <span className='block mb-5'>Xóa lịch này?</span>
                          <span className='font-medium'>
                            Ngày: {dayjs(entry.date).format('DD-MM-YYYY')}
                          </span>
                          <br />
                          <span className='font-medium'>Giờ: {entry.time}</span>
                          <br />
                          <span className='font-medium'>
                            Số lượng: {entry.amount} ml
                          </span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Đừng</AlertDialogCancel>
                        <AlertDialogAction
                          className='bg-[salmon] text-white'
                          onClick={() =>
                            useBabyFeedStore.getState().removeEntry(entry.id)
                          }
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className='text-center text-gray-500'>
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {filteredEntries.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell className='font-bold'>Tổng</TableCell>
              <TableCell colSpan={4} className='font-bold text-right'>
                {filteredEntries.length} lần –{' '}
                {filteredEntries.reduce((acc, e) => acc + e.amount, 0)} ml
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
