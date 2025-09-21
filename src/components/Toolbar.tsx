'use client';

import React, { useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Transition,
} from 'motion/react';
import { cn } from '@/lib/utils';
import useClickOutside from '@/hooks/useClickOutside';
import { Baby, Ellipsis, Milk, Utensils } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ImportDataDialog from './ImportDataDialog';
import ExportDataDialog from './ExportDataDialog';

const transition: Transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.25,
};

const ITEMS = [
  {
    id: 1,
    label: 'Trang chủ',
    icon: <Baby className='w-7 h-7' strokeWidth={1} />,
    href: '/',
  },
  {
    id: 2,
    label: 'Lịch em ăn sữa',
    icon: <Utensils className='w-7 h-7' strokeWidth={1} />,
    href: '/lich-em-an-sua',
  },
  {
    id: 3,
    label: 'Lịch mẹ hút sữa',
    icon: <Milk className='w-7 h-7' strokeWidth={1} />,
    href: '/lich-me-hut-sua',
  },
  {
    id: 4,
    label: 'Menu',
    icon: <Ellipsis className='w-7 h-7' strokeWidth={1} />,
    content: (
      <div className='flex flex-col space-y-4'>
        <ImportDataDialog />
        <ExportDataDialog />
      </div>
    ),
  },
];

export default function ToolbarExpandable() {
  const [active, setActive] = useState<number | null>(null);
  const [contentRef, { height: heightContent }] = useMeasure();
  const [menuRef, { width: widthContainer }] = useMeasure();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);

  const pathname = usePathname();

  useClickOutside(ref, () => {
    setIsOpen(false);
    setActive(null);
  });

  useEffect(() => {
    if (!widthContainer || maxWidth > 0) return;

    setMaxWidth(widthContainer);
  }, [widthContainer, maxWidth]);

  return (
    <MotionConfig transition={transition}>
      <div className='bottom-0 left-0 fixed px-4 pb-4 w-full' ref={ref}>
        <div className='bg-white border border-zinc-950/10 rounded-xl w-full h-full'>
          <div className='overflow-hidden'>
            <AnimatePresence initial={false} mode='sync'>
              {isOpen ? (
                <motion.div
                  key='content'
                  initial={{ height: 0 }}
                  animate={{ height: heightContent || 0 }}
                  exit={{ height: 0 }}
                  style={{
                    width: maxWidth,
                  }}
                >
                  <div ref={contentRef} className='p-2'>
                    {ITEMS.map((item) => {
                      const isSelected = active === item.id;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isSelected ? 1 : 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <div
                            className={cn(
                              'px-2 pt-2 text-sm',
                              isSelected ? 'block' : 'hidden'
                            )}
                          >
                            {item.content}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div
            className='flex justify-between items-center gap-4 p-4'
            ref={menuRef}
          >
            {ITEMS.map((item) =>
              item.content ? (
                <button
                  key={item.id}
                  className={cn('nav-btn', pathname === item.href && 'active')}
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                    setActive(active === item.id ? null : item.id);
                  }}
                >
                  <div>{item.icon}</div>
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn('nav-btn', pathname === item.href && 'active')}
                >
                  <div>{item.icon}</div>
                  <span>{item.label}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
