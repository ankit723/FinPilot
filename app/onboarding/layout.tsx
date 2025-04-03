import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/themeToggle";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <div>
          <Link href="/" className="font-semibold text-xl">
            FinePilot
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          <ThemeToggle />
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: {
                  height: 36,
                  width: 36,
                },
              },
            }}
          />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
} 