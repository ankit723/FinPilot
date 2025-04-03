"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import GlassCard from "@/app/components/ui/glass-card";
import NeonText from "@/app/components/ui/neon-text";
import NeoBorder from "@/app/components/ui/neo-border";

const navigation = [
  {
    title: "Finance Management",
    items: [
      { name: "Dashboard", href: "/banking/dashboard" },
      { name: "Accounts", href: "/banking/accounts" },
      { name: "Transactions", href: "/banking/transactions" },
    ],
  },
  {
    title: "Loans & Credit",
    items: [
      { name: "Loans", href: "/banking/loans" },
      { name: "Apply for Loan", href: "/banking/apply-loan" },
    ],
  },
  {
    title: "Personal",
    items: [
      { name: "My Profile", href: "/banking/profile" },
      { name: "Financial Goals", href: "/banking/tasks" },
    ],
  },
];

const SidebarLink = ({ 
  href,
  children,
  isActive,
  onClick,
}: { 
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      href={href} 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block mb-2"
    >
      <NeoBorder 
        color={isActive ? "blue" : (isHovered ? "blue" : "white")}
        variant={isActive ? "solid" : "subtle"}
        className="w-full"
      >
        <GlassCard 
          intensity={isActive ? "medium" : "light"}
          className={cn(
            "py-2 px-3 w-full text-white/90 transition-all duration-300",
            isActive && "text-white"
          )}
        >
          {children}
        </GlassCard>
      </NeoBorder>
    </Link>
  );
};

const NavigationContent = ({ pathname, onClick }: { pathname: string; onClick?: () => void }) => (
  <div className="space-y-6">
    {navigation.map((section) => (
      <div key={section.title} className="space-y-3">
        <NeonText color="blue" size="md" className="block mb-2 px-1">
          {section.title}
        </NeonText>
        <div>
          {section.items.map((item) => (
            <SidebarLink 
              key={item.href} 
              href={item.href}
              isActive={pathname === item.href}
              onClick={onClick}
            >
              {item.name}
            </SidebarLink>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="w-full">
        <NavigationContent pathname={pathname} />
      </div>

      {/* Mobile Menu Button - Show in header on mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="h-12 w-12 rounded-full shadow-lg bg-blue-600 text-white flex items-center justify-center">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 sm:max-w-xs bg-transparent border-none">
            <GlassCard intensity="medium" className="h-full p-4">
              <div className="py-4">
                <NavigationContent 
                  pathname={pathname} 
                  onClick={() => setOpen(false)} 
                />
              </div>
            </GlassCard>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
} 