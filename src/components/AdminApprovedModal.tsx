import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
}

export default function AdminApprovedModal({ open }: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    logout();
    navigate("/login");
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Você foi aceito como <span className="text-gradient">Administrador</span>!
          </DialogTitle>
          <DialogDescription className="text-center text-base space-y-4 pt-4">
            <p>
              Parabéns! Sua solicitação foi aprovada.
            </p>
            <p className="font-semibold text-foreground">
              Saia da conta e efetue o login novamente para ativar suas permissões de administrador.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            size="lg"
            onClick={handleLogin}
            className="w-full"
          >
            Efetuar Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
