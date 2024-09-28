import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

// Initialize Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PlanIT - Event Management Platform",
  description: "PlanIT is an event management platform.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
      <AppRouterCacheProvider>
        
        {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
