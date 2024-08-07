import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";
import styles from "../dash.module.css";
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
  const cookieStore = cookies();
  const hasCookies =
    cookieStore.has("accessToken") && cookieStore.has("refreshToken");

  if (!hasCookies) {
    return redirect("/credential/login");
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className={styles.dashboard}>
          <DashboardNavbar />
          {children}
        </main>
      </body>
    </html>
  );
}
