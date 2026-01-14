import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import Index from "./pages/Index";
import Peta from "./pages/Peta";
import EWS from "./pages/EWS";
import Analisis from "./pages/Analisis";
import Data from "./pages/Data";
import Dokumen from "./pages/Dokumen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/peta" element={<Peta />} />
          <Route path="/ews" element={<EWS />} />
          <Route path="/analisis" element={<Analisis />} />
          <Route path="/data" element={<Data />} />
          <Route path="/dokumen" element={<Dokumen />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
