import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

const LayOut = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 relative">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Wrapper */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Header */}
                <Header />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/50">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Floating Action Button (Mobile Only) */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed bottom-6 right-6 z-30 lg:hidden p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all duration-200"
                aria-label="Open Menu"
            >
                <Menu className="w-6 h-6" />
            </button>
        </div>
    );
}

export default LayOut;