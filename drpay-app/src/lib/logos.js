import React from 'react';

export const BrandLogos = {
  // Vodafone - Red
  VODAFONE: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#E60000" />
      <path d="M50 30c-11 0-20 9-20 20s9 20 20 20c3 0 7-1 10-2l-2-6c-2 1-5 2-8 2-8 0-14-6-14-14s6-14 14-14c3 0 6 1 8 2l2-6c-3-1-7-2-10-2z" fill="white" />
      <path d="M60 40l6-6c2 2 4 5 5 8l-8 2c-1-2-2-3-3-4z" fill="white" />
    </svg>
  ),
  // Orange - Orange
  ORANGE: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" rx="20" fill="#FF7900" />
      <text x="50" y="65" fontSize="40" fontWeight="bold" fill="white" textAnchor="middle">O</text>
    </svg>
  ),
  // Etisalat - Green
  ETISALAT: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#719F1E" />
      <path d="M30 40c0-5 20-10 20-10s20 5 20 10c0 10-10 20-20 20s-20-10-20-20z" fill="white" opacity="0.8" />
      <text x="50" y="70" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">etisalat</text>
    </svg>
  ),
  // WE (Telecom Egypt) - Purple
  WE: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" rx="20" fill="#502484" />
      <text x="50" y="65" fontSize="45" fontWeight="black" fill="#FFC800" textAnchor="middle">we</text>
    </svg>
  ),
  // Fawry - Yellow/Blue
  FAWRY: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" rx="20" fill="#FFD400" />
      <text x="50" y="65" fontSize="30" fontWeight="bold" fill="#003399" textAnchor="middle">Fawry</text>
    </svg>
  ),
  // General Utilities
  ELECTRICITY: () => (
    <div className="w-full h-full flex items-center justify-center bg-yellow-500 rounded-2xl">
      <span className="text-4xl text-white">⚡</span>
    </div>
  ),
  WATER: () => (
    <div className="w-full h-full flex items-center justify-center bg-blue-500 rounded-2xl">
      <span className="text-4xl text-white">💧</span>
    </div>
  ),
  GAS: () => (
    <div className="w-full h-full flex items-center justify-center bg-orange-600 rounded-2xl">
      <span className="text-4xl text-white">🔥</span>
    </div>
  ),
};

export const getBrandLogo = (name) => {
  const n = name.toLowerCase();
  if (n.includes('فودافون') || n.includes('vodafone')) return <BrandLogos.VODAFONE />;
  if (n.includes('اورنج') || n.includes('orange')) return <BrandLogos.ORANGE />;
  if (n.includes('اتصالات') || n.includes('etisalat')) return <BrandLogos.ETISALAT />;
  if (n.includes('وي') || n.includes(' we ') || n.includes('تي اي انترنت')) return <BrandLogos.WE />;
  if (n.includes('فوري') || n.includes('fawry')) return <BrandLogos.FAWRY />;
  if (n.includes('كهرباء')) return <BrandLogos.ELECTRICITY />;
  if (n.includes('مياه')) return <BrandLogos.WATER />;
  if (n.includes('غاز')) return <BrandLogos.GAS />;
  return null;
};
