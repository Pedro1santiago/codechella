import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateSolicitationStatus } from "@/lib/solicitationStorage";

interface AdminPromotionModalProps {
  open: boolean;
}

export default function AdminPromotionModal({ open }: AdminPromotionModalProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleRelogin = () => {
    updateSolicitationStatus("APROVADA");
    logout();
    navigate("/login");
  };

  return (
    <Dialog open={open}>
      <DialogContent 
        className="max-w-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-500"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="text-center space-y-6 py-4">
          {/* Ícone animado */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 animate-ping">
              <div className="bg-green-500/20 rounded-full w-24 h-24 mx-auto"></div>
            </div>
            <div className="relative bg-green-500/10 border-2 border-green-500 rounded-full p-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold text-green-700 dark:text-green-400">
              🎉 Parabéns!
            </h2>
            <p className="text-lg font-semibold text-green-600 dark:text-green-300">
              Você foi promovido a Administrador!
            </p>
          </div>

          {/* Mensagem */}
          <div className="bg-white/60 dark:bg-black/20 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sua solicitação foi <strong className="text-green-600 dark:text-green-400">aprovada</strong>!
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Para ativar suas <strong>permissões de administrador</strong>, você precisa fazer logout e login novamente.
            </p>
          </div>

          {/* Botão */}
          <Button 
            onClick={handleRelogin}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-6 text-base shadow-lg"
            size="lg"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Fazer Logout e Login Novamente
          </Button>

          <p className="text-xs text-muted-foreground">
            🔒 Esta ação é necessária para atualizar suas credenciais
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LogOut({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
