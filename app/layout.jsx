import "./globals.css";

export const metadata = {
  title: "Document Checklist",
  description: "Thai Document Checklist – Next.js + Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
