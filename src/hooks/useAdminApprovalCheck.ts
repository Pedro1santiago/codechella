import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { verificarStatusSolicitacao } from "@/api/codechellaApi";

export function useAdminApprovalCheck() {
  const { user } = useAuth();
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    if (!user || !user.id || !user.token) return;
    if (user.tipoUsuario === "ADMIN" || user.tipoUsuario === "SUPER") return;

    const checkStatus = async () => {
      try {
        const status = await verificarStatusSolicitacao(user.id, user.token);
        if (status === "APROVADA") {
          setShowApprovalModal(true);
        }
      } catch (e) {
        console.error("Erro ao verificar aprovação:", e);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, [user]);

  return showApprovalModal;
}
