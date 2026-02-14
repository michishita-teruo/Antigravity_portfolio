import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Demo } from './components/Demo';
import { TechStack } from './components/TechStack';
import { Pricing } from './components/Pricing';
import { Models } from './components/Models';
import { RetroLayout } from './components/RetroLayout';
import { RetroTop } from './components/RetroTop';
import { RetroProfile } from './components/RetroProfile';
import { RetroDiary } from './components/RetroDiary';
import { RetroBBS } from './components/RetroBBS';
import { RetroLink } from './components/RetroLink';
import { RetroMail } from './components/RetroMail';
import { RetroUnderConstruction } from './components/RetroUnderConstruction';
import { Github, Twitter, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { Skills } from './components/Skills';

const Home = () => (
  <>
    <Hero />
    <Features />
    <Skills />
    <Demo />
    <TechStack />
  </>
);

const NavLink = ({ to, children, mobile = false, onClick }: { to: string, children: React.ReactNode, mobile?: boolean, onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${mobile ? 'block text-2xl py-2' : 'text-sm font-medium'} ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors relative`}
      onClick={onClick}
    >
      {children}
      {!mobile && isActive && (
        <motion.div
          layoutId="underline"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-antigravity-purple"
        />
      )}
    </Link>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/retro" element={<RetroLayout />}>
          <Route index element={<RetroTop />} />
          <Route path="profile" element={<RetroProfile />} />
          <Route path="diary" element={<RetroDiary />} />
          <Route path="bbs" element={<RetroBBS />} />
          <Route path="link" element={<RetroLink />} />
          <Route path="mail" element={<RetroMail />} />
          <Route path="construction" element={<RetroUnderConstruction />} />
        </Route>
        <Route path="*" element={
          <div className="min-h-screen bg-antigravity-dark text-white font-sans selection:bg-antigravity-purple/30">
            <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/10 px-6 py-4">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-antigravity-purple to-antigravity-blue z-50 relative">
                  Antigravity
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                  <div className="flex gap-6">
                    <NavLink to="/">ホーム</NavLink>
                    <NavLink to="/pricing">プランと料金</NavLink>
                    <NavLink to="/models">モデル</NavLink>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex gap-4">
                    <a href="https://github.com/michishita-teruo/Antigravity_portfolio" target="_blank" rel="noopener noreferrer" className="hover:text-antigravity-purple transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="hover:text-blue-400 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden z-50 relative"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Nav Overlay */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="fixed inset-0 bg-antigravity-dark/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8"
                    >
                      <NavLink to="/" mobile onClick={() => setIsMenuOpen(false)}>ホーム</NavLink>
                      <NavLink to="/pricing" mobile onClick={() => setIsMenuOpen(false)}>プランと料金</NavLink>
                      <NavLink to="/models" mobile onClick={() => setIsMenuOpen(false)}>モデル</NavLink>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/models" element={<Models />} />
              </Routes>
            </main>

            <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-800">
              <p>&copy; {new Date().getFullYear()} Antigravity Agent. All rights reserved.</p>
              <p className="mt-2">Designed & Built by AI.</p>
              <p className="mt-4 opacity-50 hover:opacity-100 transition-opacity">
                <Link to="/retro" className="text-xs">Old Version</Link>
              </p>
            </footer>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
