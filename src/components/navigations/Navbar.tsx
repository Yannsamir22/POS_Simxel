import { LogOut, User } from "lucide-react";
import React from "react";
import ToggleLanguage from "../toggles/ToggleLanguage";
import ToggleTheme from "../toggles/ToggleTheme";

const Navbar: React.FC = () => {
  return (
    <header className="fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 border-b border-base-200">
      <div className="container mx-auto h-16 flex items-center justify-between px-4 pl-0">
        <div className="flex items-center justify-center pl-0">
          <figure className="h-20 w-20" >
            <img src="Sample.svg" alt="test" className="h-full"/>
          </figure>
          <span className="text-3xl font-bold cursor-pointer" >Simxel</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn rounded-md font-bold border-none bg-transparent hover:bg-error/10 hover:text-error transition-all">
            <span className="max-sm:hidden text-sm">LogOut</span>
            <LogOut size={20} />
          </button>
          <button className="btn btn-ghost rounded-md font-bold">
            <span className="max-sm:hidden text-sm">Admin</span>
            <User size={20} />
          </button>
          <ToggleLanguage />
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
