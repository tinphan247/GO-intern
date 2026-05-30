import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'G-Scores — Tra Cứu & Phân Tích Điểm Thi THPT 2024',
  description: 'Hệ thống tra cứu điểm thi THPT Quốc gia 2024, phân tích phổ điểm khối thi và công bố thủ khoa Khối A.',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <div className="glowing-bg"></div>
        <div className="glowing-bg-sec"></div>
        {children}
      </body>
    </html>
  );
}
