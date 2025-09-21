'use client';

import dayjs from 'dayjs';
import Image from 'next/image';

export default function Home() {
  const birthDate = dayjs('2025-09-14');
  const today = dayjs();

  const diffDays = today.diff(birthDate, 'day');
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  const months = (diffDays / 30).toFixed(1);

  return (
    <div>
      <Image
        alt='MK'
        width={0}
        height={0}
        sizes='100vw'
        style={{ width: '100%', height: 'auto' }}
        src='/MK.jpg'
        priority
        className='rounded-lg'
      />

      <h1 className='text-center charmonman-bold text-[salmon] my-10 text-3xl'>
        Đỗ Ngọc Minh Khôi
      </h1>
      <p className='text-center'>Chào ông bà zà,</p>
      <h1 className='text-center'>
        Tui đã được: {weeks.toString().padStart(2, '0')} tuần{' '}
        {days.toString().padStart(2, '0')} ngày ({months} tháng tuổi)
      </h1>
    </div>
  );
}
