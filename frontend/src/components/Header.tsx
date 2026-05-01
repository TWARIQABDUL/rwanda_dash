import { useState } from "react";
import { Bell, Search, Plus } from "lucide-react";
import OrderModal from "./OrderModal";

const Header = () => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 transition-all duration-300 shadow-sm">
        {/* Left side: Search */}
        <div className="flex items-center gap-4 flex-1">
          <div className="max-w-md w-full relative group hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Right side: Actions & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => setIsOrderModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Order</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            <Bell className="w-5 h-5" />
          </button>
          
          <button className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-colors">
            <img
              className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-700">Admin User</p>
            </div>
          </button>
        </div>
      </header>
      
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </>
  );
};

export default Header;
