import { Metadata } from "next";
import "../public/assets/css/bootstrap.min.css";
import "../public/assets/css/common.css";
import "../public/assets/css/main.css";
import "../public/assets/css/responsive.css";
import { AppProviders } from "./components/providers/app-providers";

export const metadata: Metadata = {
  title: "Buddyscript",
  icons: {
    icon: "/assets/images/logo-copy.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/assets/images/logo-copy.svg"
          type="image/svg+xml"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
