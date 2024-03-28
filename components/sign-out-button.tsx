"use client";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();
  return (
    <Button
      onClick={() => signOut(() => router.push("/"))}
      className="px-2"
      title="Cerrar sesión"
      variant="ghost"
    >
      <LogOutIcon />
    </Button>
  );
}
