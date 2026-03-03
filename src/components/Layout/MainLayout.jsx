import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    // 1. The crucial state that connects the Header hamburger button to the Sidebar drawer
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // 2. Automatically scroll to the top when navigating to a new page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // 3. Prevent the background page from scrolling when the mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileOpen]);

    return (
        // We use h-screen to lock the overall layout to the viewport height
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">

            {/* Subtle Global Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.03),transparent_50%)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.03),transparent_50%)]"></div>
            </div>

            {/* Sidebar: Receives the mobile state and the setter */}
            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

            {/* Main Content Wrapper */}
            {/* min-w-0 prevents flex items from overflowing their container on small screens */}
            <div className="flex-1 flex flex-col min-w-0 z-10 relative h-full">

                {/* Header: Receives the setter so the hamburger button can open the sidebar */}
                <Header setMobileOpen={setMobileOpen} />

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar relative bg-slate-950/50">

                    {/* Inner container for consistent padding */}
                    <div className="p-4 md:p-6 lg:p-8 min-h-full flex flex-col">

                        {/* Your actual page content loads here */}
                        <div className="flex-1">
                            <Outlet />
                        </div>

                        {/* Footer */}
                        <footer className="mt-auto pt-8 pb-2">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-800/60 pt-4">
                                <div className="flex items-center gap-3">
                                    <p>
                                        © {new Date().getFullYear()} <span className="text-indigo-400 font-medium">Agartex Systems</span>. All rights reserved.
                                    </p>
                                    <span className="hidden md:inline w-1 h-1 bg-slate-700 rounded-full"></span>
                                    <span className="hidden md:inline">v2.0.0</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                    <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
                                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                    <a href="#" className="hover:text-indigo-400 transition-colors">Support</a>
                                </div>
                            </div>
                        </footer>

                    </div>
                </main>
            </div>

            {/* Modern, sleek scrollbar CSS */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(71, 85, 105, 0.4); /* slate-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(99, 102, 241, 0.6); /* indigo-500 */
        }
      `}</style>
        </div>
    );
};

export default MainLayout;