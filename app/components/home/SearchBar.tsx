'use client';

import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/customize');
  };

  return (
    <div 
      className="relative w-full max-w-2xl mx-auto cursor-pointer"
      onClick={handleClick}
    >
      <Input
        className="w-full h-14 pl-12 pr-4 text-lg bg-white shadow-lg rounded-lg"
        placeholder="Where do you want to explore?"
        readOnly
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </div>
  );
};

export default SearchBar; 