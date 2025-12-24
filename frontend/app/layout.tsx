import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Parlant vs Traditional LLM - Life Insurance Agent Demo',
  description: 'Compare structured AI agents with traditional monolithic prompts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

