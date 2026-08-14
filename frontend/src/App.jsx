import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import ProjectPage from "@/pages/ProjectPage";

function LenisRoot() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
}

function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="App bg-ink min-h-screen">
      <BrowserRouter>
        <LenisRoot />
        <ScrollManager />
        <Cursor />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:slug" element={<ProjectPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <div className="noise-overlay" aria-hidden />
      <Toaster position="top-center" theme="dark" />
    </div>
  );
}

export default App;
