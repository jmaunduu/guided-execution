import { Outlet, useLocation } from 'react-router-dom';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileBottomNav } from './MobileBottomNav';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -100,
  },
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.4, 0, 0.2, 1] as const,
  duration: 0.35,
};

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground intensity="low" />
      <DesktopNavbar />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="container mx-auto px-4 py-6 pb-24 sm:pb-6 relative z-10"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      
      <MobileBottomNav />
    </div>
  );
}
