import React, { useMemo } from 'react';

const ITEMS = [
  { char: '💍', label: 'Ring' },
  { char: '🎟️', label: 'Voucher' },
  { char: '🍺', label: 'Heineken' },
];

export function FallingItems() {
  const elements = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const startLeft = Math.random() * 100;
      const duration = 5 + Math.random() * 10;
      const delay = Math.random() * 5;
      const size = 20 + Math.random() * 30;
      
      return (
        <div
          key={i}
          className="fixed pointer-events-none z-0 animate-fall"
          style={{
            left: `${startLeft}%`,
            top: '-50px',
            fontSize: `${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          {item.char}
        </div>
      );
    });
  }, []);

  return <>{elements}</>;
}
