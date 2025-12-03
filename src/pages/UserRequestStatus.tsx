import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Clock, CheckCircle2, XCircle, FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getSolicitation, updateSolicitationStatus } from "@/lib/solicitationStorage";
import { verificarStatusSolicitacao } from "@/api/codechellaApi";

export default function UserRequestStatus() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

    async function buscarStatus() {
      const solicitation = getSolicitation();
      
      if (!solicitation || solicitation.userId !== user.id) {
        setStatus(null);
        setLoading(false);
        return;
      }

      // Se já está aprovada ou negada localmente, não precisa verificar mais
      if (solicitation.status === "APROVADA" || solicitation.status === "NEGADA") {
        setStatus(solicitation.status);
        setUserName(solicitation.userName);
        setLoading(false);
        return;
      }

      // Verificar status real no backend
      try {
        const resultado = await verificarStatusSolicitacao(user.id, user.token);
        
        if (resultado && resultado.status) {
          // Atualizar localStorage se mudou
          if (resultado.status !== solicitation.status) {
            updateSolicitationStatus(resultado.status);
          }
          
          setStatus(resultado.status);
        } else {
          // Fallback para status local se backend não retornar nada
          setStatus(solicitation.status);
        }
        
        setUserName(solicitation.userName);
      } catch (error) {
        // Fallback para status local em caso de erro
        setStatus(solicitation.status);
        setUserName(solicitation.userName);
      } finally {
        setLoading(false);
      }
    }

    buscarStatus();
    // Atualizar a cada 5 segundos para verificar mudanças no backend
    const interval = setInterval(buscarStatus, 5000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusConfig = () => {
    switch (status) {
      case "PENDENTE":
        return {
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          title: "Solicitação Pendente",
          message: "Sua solicitação está em análise. Aguarde a aprovação do Super Admin.",
          showAction: false
        };
      case "APROVADA":
        return {
          icon: CheckCircle2,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          title: "Solicitação Aprovada! 🎉",
          message: "Parabéns! Você foi aceito como administrador. Faça logout e login novamente para ativar suas permissões.",
          showAction: true
        };
      case "NEGADA":
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          title: "Solicitação Negada",
          message: "Infelizmente sua solicitação não foi aprovada. Entre em contato com o suporte para mais informações.",
          showAction: false
        };
      default:
        return {
          icon: FileQuestion,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
          title: "Nenhuma Solicitação Encontrada",
          message: "Você ainda não fez uma solicitação para se tornar administrador.",
          showAction: true,
          actionText: "Fazer Solicitação",
          actionRoute: "/solicitar-admin"
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando status...</p>
          </div>
        </div>
      </div>
    );
  }

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-2xl">
          <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-8 md:p-12 shadow-2xl`}>
            <div className="text-center space-y-6">
              {/* Ícone */}
              <div className="flex justify-center">
                <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-full p-6`}>
                  <Icon className={`w-16 h-16 ${config.color}`} />
                </div>
              </div>

              {/* Título */}
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {config.title}
              </h1>

              {/* Mensagem */}
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                {config.message}
              </p>

              {/* Informações do usuário */}
              {status && (
                <div className="bg-background/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Usuário:</strong> {userName || user?.nome || user?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Status atual:</strong> <span className={`font-semibold ${config.color}`}>{status}</span>
                  </p>
                </div>
              )}

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {config.showAction && status === "APROVADA" && (
                  <Button 
                    onClick={handleLogout}
                    className="flex-1"
                    size="lg"
                  >
                    Fazer Logout e Login Novamente
                  </Button>
                )}
                {config.showAction && !status && (
                  <Button 
                    onClick={() => navigate("/solicitar-admin")}
                    className="flex-1"
                    size="lg"
                  >
                    Fazer Solicitação
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="flex-1"
                  size="lg"
                >
                  Voltar para Início
                </Button>
              </div>

              {/* Nota de atualização automática */}
              {status === "PENDENTE" && (
                <p className="text-xs text-muted-foreground pt-4">
                  Esta página atualiza automaticamente a cada 5 segundos
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
