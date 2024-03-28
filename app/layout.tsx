import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { Open_Sans } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";

import { Providers } from "@/app/providers";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Toaster } from "@/components/ui/toaster";
import { Button, buttonVariants } from "@/components/ui/button";
import AuthButtons from "@/components/auth-buttons";

import "./globals.css";
import "@uploadthing/react/styles.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "House Inmobiliaria",
  description: "Administra tus propiedades de manera sencilla y rapida.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      localization={esES}
      appearance={{
        elements: {
          card: "bg-background shadow-none sm:shadow-lg sm:ring-2 sm:ring-primary -sm:p-2",
          headerTitle: "text-foreground",
          headerSubtitle: "text-foreground/70 font-light",
          socialButtonsBlockButton: buttonVariants({ variant: "outline" }),
          socialButtonsBlockButtonText: "text-foreground",
          dividerLine: "bg-muted",
          dividerText: "text-foreground/60",
          formFieldLabel: "text-foreground",
          formFieldInput: "bg-background border border-input text-foreground",
          footerActionText: "text-foreground/70",
        },
        variables: {
          colorPrimary: "hsl(142.1 70.6% 45.3%)",
        },
      }}
    >
      <html lang="es" suppressHydrationWarning>
        <body className={openSans.className}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Providers>
            <header className="container flex justify-between p-2">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button title="Inicio" className="p-2" variant="outline">
                    <Home />
                  </Button>
                </Link>
                <ThemeSwitcher />
              </div>
              <AuthButtons />
            </header>
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
