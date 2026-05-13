import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-12 px-6 mt-auto border-t border-slate-200 bg-white/50 backdrop-blur-md relative z-0 overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          {/* Logo or Project Name */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">f</div>
            <span className="text-2xl font-black text-text-main tracking-tight">fci Classroom</span>
          </div>

          {/* Credits */}
          <div className="space-y-2">
            <p className="text-text-secondary font-medium text-lg">
              Designed & Developed with <span className="text-red-500 animate-pulse">❤️</span> by
            </p>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-text-main font-extrabold text-xl tracking-tight">
              <span className="hover:text-primary transition-colors cursor-default">Abdelrahman Mahmoud</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-secondary transition-colors cursor-default">Mohamed Hesham</span>
              <span className="text-slate-300">•</span>
              <span className="hover:text-primary transition-colors cursor-default">Mohamed Dahy</span>
            </div>
          </div>

          {/* Links or Badges (Optional but adds to premium feel) */}
          <div className="flex gap-4 mt-4">
             <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border border-slate-200">
               FCI Production © {currentYear}
             </div>
             <div className="px-4 py-1.5 bg-green-50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-green-600 border border-green-100">
               v1.0 Premium
             </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
