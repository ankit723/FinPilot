'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, User, Settings, FileText, CreditCard, DollarSign } from 'lucide-react'

// Define navigation links locally instead of importing them
const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Banking', href: '/banking/dashboard', icon: CreditCard },
  { name: 'Payments', href: '/payments', icon: DollarSign },
]

const DashboardItems = () => {
    const pathname = usePathname()
  return (
    <div className='flex flex-col gap-2'>
        {
            navLinks.map((link) => (
                <Link href={link.href} key={link.name} className={cn(
                    pathname === link.href? 'bg-primary/10 text-primary': 'text-muted-foreground',
                    'flex items-center gap-2 px-2 font-medium lg:px-4 py-2 rounded-md transition-all hover:bg-primary/10 text-sm lg:text-base'
                )}>
                    <link.icon className="w-4 h-4" />
                    {link.name}
                </Link>
            ))
        }
    </div>
  )
}

export default DashboardItems