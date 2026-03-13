// src/pages/SignInPage.tsx
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <SignIn
          routing="path" 
          path="/sign-in"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "flex justify-center w-full",
              card: "w-full rounded-2xl shadow-xl border border-border p-6",
              headerTitle: "text-center text-2xl font-bold mb-2",
              headerSubtitle: "text-center text-sm text-muted-foreground mb-4",
              formButtonPrimary:
                "w-full rounded-full bg-primary text-primary-foreground py-2 hover:bg-primary/90 transition-all",
              socialButtonsList: "flex justify-center gap-2 mt-4", 
            },
          }}
        />
      </div>
    </div>
  );
}