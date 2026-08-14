import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Research from "./pages/Research.jsx";
import Publications from "./pages/Publications.jsx";
import Join from "./pages/Join.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

// Lazy-loaded: pulls in @supabase/supabase-js, which public marketing
// pages shouldn't have to download just because this unlisted admin
// route exists in the router.
const Applications = lazy(() => import("./pages/Applications.jsx"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col bg-charcoal-950">
      <div className="noise-overlay" />
      <ScrollToTop />
      <Navbar />
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/research" element={<Research />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/join" element={<Join />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/applications"
              element={
                <Suspense fallback={<div className="min-h-screen" />}>
                  <Applications />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
