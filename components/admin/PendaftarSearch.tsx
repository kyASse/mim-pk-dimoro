"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PendaftarSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function PendaftarSearch({ 
  onSearch, 
  placeholder = "Cari nama siswa atau ID registrasi" 
}: PendaftarSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}
