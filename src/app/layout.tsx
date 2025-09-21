import type { Metadata } from 'next';
import { Shantell_Sans } from 'next/font/google';
import './globals.css';
import ToolbarExpandable from '@/components/Toolbar';

const shantellSans = Shantell_Sans({
  subsets: ['vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Minh Khôi Tracker',
  description: 'Ứng dụng theo dõi bé',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='vi'>
      <body
        className={`${shantellSans.className} antialiased h-screen flex flex-col pt-4 px-4 bg-gray-50`}
      >
        <main className='flex-1 pb-14 overflow-y-auto'>{children}</main>

        <ToolbarExpandable />
      </body>
    </html>
  );
}
