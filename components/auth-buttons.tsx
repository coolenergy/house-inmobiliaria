import { SignUpButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/sign-out-button";

export default function AuthButtons() {
  return (
    <div>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <div className="flex gap-2">
          <SignUpButton>
            <Button className="font-semibold">Crear cuenta</Button>
          </SignUpButton>
          <SignInButton>
            <Button variant="outline" className="font-semibold">
              Acceder
            </Button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
