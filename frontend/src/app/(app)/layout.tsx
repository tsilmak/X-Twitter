import type { Metadata } from "next";
import "./app.css";
import Navigation from "@/hooks/Navigation";
import GrokIconButton from "@/components/common/grok/GrokIconButton";
import MessagesButton from "@/components/common/MessagesButton";

export const metadata: Metadata = {
  title: "X",
  description: "X App",
  openGraph: {
    title: "X",
    description: "X (formerly Twitter)",
    images: [
      {
        url: `${process.env.MAIN_IMAGE_URL}`,
        alt: "X Social Platform",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen justify-center dark:bg-black">
      <div className="w-full max-w-screen-xl sm:flex">
        <Navigation />
        <main className="mt-14 w-full sm:ml-20 sm:mt-0 xl:ml-64">
          {children}
          <GrokIconButton />
          <MessagesButton />
        </main>
      </div>
    </div>
  );
}
