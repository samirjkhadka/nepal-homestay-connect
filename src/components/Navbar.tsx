 import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
 import { Menu, X, Globe, ChevronDown, Moon, Sun, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

 import { useTheme } from '@/components/ThemeProvider';
 
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Search', href: '/search' },
  { name: 'Packages', href: '/packages' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
   const { theme, setTheme } = useTheme();
   const [isDark, setIsDark] = useState(false);
 
   useEffect(() => {
     const root = document.documentElement;
     setIsDark(root.classList.contains('dark'));
   }, [theme]);
 
   const toggleTheme = () => {
     setTheme(isDark ? 'light' : 'dark');
     setIsDark(!isDark);
   };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">N</span>
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                Nepali Homestays
              </span>
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                <motion.span whileHover={{ y: -2 }} className="block">
                  {item.name}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
             {/* Theme Toggle */}
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={toggleTheme}
               className="p-2 rounded-lg hover:bg-muted transition-colors"
               aria-label="Toggle theme"
             >
               <AnimatePresence mode="wait" initial={false}>
                 {isDark ? (
                   <motion.div
                     key="sun"
                     initial={{ rotate: -90, opacity: 0 }}
                     animate={{ rotate: 0, opacity: 1 }}
                     exit={{ rotate: 90, opacity: 0 }}
                     transition={{ duration: 0.2 }}
                   >
                     <Sun className="w-5 h-5 text-accent" />
                   </motion.div>
                 ) : (
                   <motion.div
                     key="moon"
                     initial={{ rotate: 90, opacity: 0 }}
                     animate={{ rotate: 0, opacity: 1 }}
                     exit={{ rotate: -90, opacity: 0 }}
                     transition={{ duration: 0.2 }}
                   >
                     <Moon className="w-5 h-5 text-muted-foreground" />
                   </motion.div>
                 )}
               </AnimatePresence>
             </motion.button>
 
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 bg-card rounded-lg shadow-elevated border border-border overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang);
                          setShowLangDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted transition-colors text-left"
                      >
                        <span>{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
             <Link to="/signin">
               <Button variant="ghost" className="font-medium">
                 <LogIn className="w-4 h-4 mr-1" />
                 Sign In
               </Button>
             </Link>
             <Link to="/signup">
               <Button className="font-medium bg-primary hover:bg-primary/90">
                 <UserPlus className="w-4 h-4 mr-1" />
                 Sign Up
               </Button>
             </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border"
          >
            <div className="section-container py-4 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className="block py-2 text-foreground/80 hover:text-primary font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-4 border-t border-border space-y-3">
                {/* Mobile Language Selector */}
                <div className="flex items-center gap-2">
                   <button
                     onClick={toggleTheme}
                     className="p-2 rounded-lg hover:bg-muted transition-colors mr-2"
                   >
                     {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                   </button>
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={currentLang.code}
                    onChange={(e) => setCurrentLang(languages.find(l => l.code === e.target.value) || languages[0])}
                    className="bg-transparent text-sm"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-3">
                   <Link to="/signin" className="flex-1">
                     <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                       Sign In
                     </Button>
                   </Link>
                   <Link to="/signup" className="flex-1">
                     <Button className="w-full" onClick={() => setIsOpen(false)}>
                       Sign Up
                     </Button>
                   </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
