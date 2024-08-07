import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import LOGO from "../../../public/CircleIcon.png";
import styles from "../page.module.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maharishi Job Portal",
  description: "Portal For Applying Into Listed Jobs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className={styles.jobMainContainer}>
          <div className={styles.heroImageContainer}>
            <Image
              src={LOGO}
              alt="Not Found"
              priority
              className={styles.image}
            />
            <h1 className={styles.heading}>
              Unlock your potential and shape your future
            </h1>
            <p className={styles.smallHeading}>
              apply today and embark on a journey of growth and success!
            </p>
          </div>

          {children}
        </main>
      </body>
    </html>
  );
}
