import { Search } from "lucide-react";
import React from "react";

interface SearchBarProps {
      value: string;
      onChange: (value: string) => void;
      placeholder?:string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "Search..." }) => {
      return (
            <div className="w-1/3 mb-4">
                  <label className="input input-bordered flex items-center gap-2 w-full">
                        <Search size={16} className="opacity-50"/>
                        <input type="text"
                        className="grow"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)} />
                  </label>
            </div>
      )
}

export default SearchBar;