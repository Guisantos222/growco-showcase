import type {
  Metadata,
} from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title:
    "growCo. Experience Lab",

  description:
    "Technical laboratory for the growCo. showcase experience.",
};

type LabRootLayoutProps = {
  children: React.ReactNode;
};

export default function LabRootLayout({
  children,
}: LabRootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}