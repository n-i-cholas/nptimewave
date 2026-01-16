import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import MemoryPortal from "./pages/MemoryPortal";
import MemoryDetail from "./pages/MemoryDetail";
import MemorySubmit from "./pages/MemorySubmit";
import QuestsPage from "./pages/Quests";
import QuestPlay from "./pages/QuestPlay";
import WalletPage from "./pages/Wallet";
import VRGallery from "./pages/VRGallery";
import AdminPortal from "./pages/AdminPortal";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/memory-portal" element={<MemoryPortal />} />
            <Route path="/memory-portal/submit" element={<MemorySubmit />} />
            <Route path="/memory-portal/:memoryId" element={<MemoryDetail />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/quests/:questId" element={<QuestPlay />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/vr-gallery" element={<VRGallery />} />
            <Route path="/admin" element={<AdminPortal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
