import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen w-full relative bg-background overflow-x-hidden text-slate-200">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {/* Deep space gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background opacity-80" />

                {/* Animated Blobs */}
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] mix-blend-screen"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
                    transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", delay: 2 }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tertiary/10 rounded-full blur-[100px] mix-blend-screen"
                />
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
                    transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", delay: 5 }}
                    className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[90px] mix-blend-screen"
                />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none z-0" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Layout;
