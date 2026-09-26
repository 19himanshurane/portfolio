import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollManager from './components/ScrollManager.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import PageLoader from './components/PageLoader.jsx';
import Background3D from './components/Background3D.jsx';
import Home from './pages/Home.jsx';
import { useLanguage } from './context/LanguageContext.jsx';

const Projects = lazy(() => import('./pages/Projects.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

export default function App() {
  const location = useLocation();
  const { lang } = useLanguage();

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        {lang === 'de' ? 'Zum Inhalt springen' : 'Skip to content'}
      </a>
      <Background3D />
      <SmoothScroll />
      <ScrollManager />
      <ScrollProgress />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          >
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </MotionConfig>
  );
}
