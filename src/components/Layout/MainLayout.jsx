import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Primary Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Grid Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px'
                    }}
                ></div>

                {/* Radial Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-900/50 to-slate-950"></div>
            </div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Header */}
                <Header />

                {/* Main Content with Custom Scrollbar */}
                <main className="flex-1 overflow-auto custom-scrollbar relative">
                    {/* Content Wrapper with Padding */}
                    <div className="min-h-full">
                        <Outlet />
                    </div>

                    {/* Decorative Elements */}
                    <div className="fixed bottom-8 right-8 pointer-events-none z-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                            <div className="relative w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full border border-purple-500/20"></div>
                        </div>
                    </div>
                </main>

                {/* Footer - Optional */}
                <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 px-6 py-4 relative z-10">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            <p className="text-slate-400">
                                © 2024 <span className="text-purple-400 font-semibold">Agartex</span>. All rights reserved.
                            </p>
                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                            <span className="text-slate-500">v1.0.2</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">Privacy</a>
                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">Terms</a>
                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">Support</a>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
          border-radius: 10px;
          transition: background 0.3s;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #2563eb);
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #8b5cf6 rgba(15, 23, 42, 0.5);
        }

        /* Radial Gradient Utility */
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }

        /* Smooth Scrolling */
        .custom-scrollbar {
          scroll-behavior: smooth;
        }

        /* Hide scrollbar on mobile for cleaner look */
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>
        </div>
    );
};

export default MainLayout;
