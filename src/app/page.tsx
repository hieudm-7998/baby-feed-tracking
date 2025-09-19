import Image from 'next/image';

export default function Home() {
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
    </div>
  );
}
