import { Metadata } from "next";
import { Providers } from "./providers";
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};
