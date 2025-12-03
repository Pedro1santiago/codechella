import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import AllEvents from "./pages/AllEvents";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "@/components/ProtectedRoute";
import CreateEvent from "@/pages/CreateEvent";
import EditEvent from "@/pages/EditEvent";
import AdminDashboard from "@/pages/AdminDashboard";
import RequestAdmin from "@/pages/RequestAdmin";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import UserRequestStatus from "@/pages/UserRequestStatus";
import { startKeepAlive } from "@/api/codechellaApi";

const queryClient = new QueryClient();

const App = () => {
  // Ativa o keep-alive para manter o servidor Render acordado
  useEffect(() => {
    const stopKeepAlive = startKeepAlive();
    return () => stopKeepAlive();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/eventos" element={<AllEvents />} />

          <Route
            path="/solicitar-admin"
            element={
              <ProtectedRoute requireRole="USER">
                <RequestAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/request-status"
            element={
              <ProtectedRoute requireRole="USER">
                <UserRequestStatus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requireRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/criar-evento"
            element={
              <ProtectedRoute requireRole="ADMIN">
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editar-evento/:id"
            element={
              <ProtectedRoute requireRole="ADMIN">
                <EditEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin"
            element={
              <ProtectedRoute requireRole="SUPER">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
