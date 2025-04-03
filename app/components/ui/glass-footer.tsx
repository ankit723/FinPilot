'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Shield, HelpCircle } from 'lucide-react';

const GlassFooter = () => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setIsSubscribed(true);
      setEmailInput('');
      // In a real app, you would send this to an API
      console.log('Subscribed with:', emailInput);
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = [
    {
      title: 'Finance Tools',
      links: [
        { name: 'Budgeting', href: '/banking/accounts' },
        { name: 'Expense Tracking', href: '/banking/transactions' },
        { name: 'Financial Goals', href: '/banking/tasks' },
        { name: 'Loans', href: '/banking/loans' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Our Mission', href: '/mission' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/get-in-touch' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
    { icon: <Linkedin size={18} />, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className={`mt-auto ${isDark ? 'bg-slate-900/30' : 'bg-slate-100/70'}`}>
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo and About */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <span className={`text-xl font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                FinePilot
              </span>
            </Link>
            <p className={isDark ? 'text-white/70 mb-6 max-w-md' : 'text-slate-700 mb-6 max-w-md'}>
              Our mission is to empower everyone to take control of their financial future through simple, intelligent, and personalized financial management tools.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className={`flex items-start ${isDark ? 'text-white/70' : 'text-slate-700'}`}>
                <Phone className={`mr-3 h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0 mt-0.5`} />
                <span>1-800-987-6543</span>
              </div>
              <div className={`flex items-start ${isDark ? 'text-white/70' : 'text-slate-700'}`}>
                <Mail className={`mr-3 h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0 mt-0.5`} />
                <span>support@finepilot.com</span>
              </div>
              <div className={`flex items-start ${isDark ? 'text-white/70' : 'text-slate-700'}`}>
                <MapPin className={`mr-3 h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0 mt-0.5`} />
                <span>350 Finance Drive, San Francisco, CA 94158</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Link 
                  key={social.label} 
                  href={social.href}
                  aria-label={social.label} 
                  className={`${isDark ? 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20' : 'text-slate-700 hover:text-slate-900 bg-slate-200/50 hover:bg-slate-200'} w-9 h-9 flex items-center justify-center rounded-full transition-colors`}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className={`transition-colors ${isDark ? 'text-white/70 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Newsletter */}
        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-y-6">
            <div className="md:col-span-1">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Subscribe to our newsletter</h3>
              <p className={isDark ? 'text-white/70 mt-1' : 'text-slate-600 mt-1'}>Stay updated with banking news and offers</p>
            </div>
            
            <div className="md:col-span-2">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/50' : 'text-slate-400'}`} size={18} />
                  <input
                    type="email"
                    placeholder="Your email address"
                    className={`w-full h-11 pl-10 pr-4 rounded-md focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-blue-400/50' 
                        : 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500/50'
                    }`}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="h-11 px-5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Subscribe</span>
                  <Send size={18} />
                </button>
              </form>
              {isSubscribed && (
                <p className="text-green-400 mt-2 text-sm">
                  Thank you for subscribing to our newsletter!
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className={`mt-12 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex flex-wrap justify-center gap-6">
            <div className={`flex items-center ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
              <Shield className={`h-5 w-5 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="text-sm">Bank-level Security</span>
            </div>
            <div className={`flex items-center ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
              <HelpCircle className={`h-5 w-5 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="text-sm">24/7 Customer Support</span>
            </div>
            <div className={`flex items-center ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
              <div className={`h-5 w-5 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'} flex items-center justify-center`}>
                <span className="text-xs font-bold">FDIC</span>
              </div>
              <span className="text-sm">FDIC Insured</span>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 text-center text-sm">
          <p className={isDark ? 'text-white/50' : 'text-slate-500'}>© {new Date().getFullYear()} FinePilot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default GlassFooter; 