import "./globals.css";

export const metadata = {
  title: "Document Checklist",
  description: "Thai Document Checklist – Next.js + Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 text-neutral-900 dark:from-neutral-900 dark:to-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
