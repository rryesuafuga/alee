import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alee - AI-Powered Smart Farming for Africa",
  description:
    "Transform plantain farming with AI disease detection and IoT-based precision farming. Detect crop diseases in seconds, receive personalised SMS advisories, and increase yields by up to 64%.",
  keywords: [
    "agriculture",
    "AI",
    "farming",
    "Uganda",
    "disease detection",
    "IoT",
    "plantain",
    "smart farming",
  ],
  openGraph: {
    title: "Alee - AI-Powered Smart Farming for Africa",
    description:
      "Transform plantain farming with AI disease detection and IoT precision farming.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
