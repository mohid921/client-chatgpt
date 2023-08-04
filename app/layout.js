import "./globals.css";
import { Inter } from "next/font/google";
import Provider from "@/components/misc/Provider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CHATGPT",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <Toaster />
        <Provider>
          <body className={inter.className}>
            <main className="bg-gray-50 dark:bg-[#09090b] min-h-screen">
              {children}
            </main>
          </body>
        </Provider>
      </html>
  );
}
