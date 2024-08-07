import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
  if (hasCookies) {
    return redirect("/dashboard");
  }
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
