import "./globals.css";

export const metadata = {
  title: "Dr. Pay | نظام الدفع الإلكتروني",
  description: "منصة الدفع الإلكتروني الأذكى - شحن، فواتير، خدمات، تحويلات",
  keywords: "دفع, شحن, فواتير, محافظ, مصر",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="animated-bg" />
        {children}
      </body>
    </html>
  );
}
