import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import MemoryPortal from "./pages/MemoryPortal";
import MemoryDetail from "./pages/MemoryDetail";
import MemorySubmit from "./pages/MemorySubmit";
import QuestsPage from "./pages/Quests";
import QuestPlay from "./pages/QuestPlay";
import WalletPage from "./pages/Wallet";
import VRGallery from "./pages/VRGallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="dark">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/memory-portal" element={<MemoryPortal />} />
            <Route path="/memory-portal/submit" element={<MemorySubmit />} />
            <Route path="/memory-portal/:memoryId" element={<MemoryDetail />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/quests/:questId" element={<QuestPlay />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/vr-gallery" element={<VRGallery />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
