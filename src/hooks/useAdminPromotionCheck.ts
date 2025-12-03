import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSolicitation, updateSolicitationStatus } from "@/lib/solicitationStorage";
import { verificarStatusSolicitacao } from "@/api/codechellaApi";

// Hook para verificar se o usuário foi promovido a admin
export function useAdminPromotionCheck() {
  const { user } = useAuth();
  const [showPromotionModal, setShowPromotionModal] = useState(false);

  useEffect(() => {
    if (!user?.token) return;

    const solicitation = getSolicitation();
    
    // Se não tem solicitação pendente, não faz nada
    if (!solicitation || solicitation.userId !== user.id || solicitation.status !== "PENDENTE") {
      return;
    }

    // IMPORTANTE: Não mostrar modal se já está logado como ADMIN/SUPER
    // (isso significa que fez login já com permissões, não foi promovido agora)
    const userType = user.tipoUsuario?.toUpperCase();
    if (userType === "ADMIN" || userType === "SUPER") {
      // Limpar solicitação pendente sem mostrar modal
      updateSolicitationStatus("APROVADA");
      return;
    }

    // Função para verificar status no backend
    async function checkStatus() {
      try {
        const resultado = await verificarStatusSolicitacao(user.id, user.token);
        
        if (resultado && resultado.status === "APROVADA") {
          updateSolicitationStatus("APROVADA");
          setShowPromotionModal(true);
        } else if (resultado && resultado.status === "NEGADA") {
          updateSolicitationStatus("NEGADA");
        }
      } catch (error) {
        // Ignora erros silenciosamente
      }
    }

    // Verificar imediatamente
    checkStatus();

    // Polling a cada 10 segundos
    const interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, [user]);

  return showPromotionModal;
}
