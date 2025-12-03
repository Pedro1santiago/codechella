import { Button } from "@/components/ui/button";
import { Music, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { hasPendingSolicitation } from "@/lib/solicitationStorage";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleCreateEvent() {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const tipo = user.tipoUsuario?.toUpperCase();
    if (tipo === "ADMIN" || tipo === "SUPER") {
      navigate("/criar-evento");
    } else {
      // Verificar se já tem solicitação pendente
      const hasPending = hasPendingSolicitation(user.id);
      
      if (hasPending) {
        alert("Você já possui uma solicitação de admin pendente. Acesse 'Meu Status' para acompanhar.");
        navigate("/user/request-status");
      } else {
        alert("Você precisa ser ADMIN para criar eventos. Faça uma solicitação.");
        navigate("/solicitar-admin");
      }
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient cursor-pointer" onClick={() => navigate("/")}>
              CodeChella
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="/#eventos" className="text-foreground hover:text-primary transition-colors font-medium">
              Eventos
            </a>
            <a href="/#categorias" className="text-foreground hover:text-primary transition-colors font-medium">
              Categorias
            </a>
            <a href="/eventos" className="text-foreground hover:text-primary transition-colors font-medium">
              Ver Todos
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>

            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    {user.nome || user.email}
                  </div>
                  {user.tipoUsuario === "ADMIN" && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Admin</span>
                  )}
                  {user.tipoUsuario === "SUPER" && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Super Admin</span>
                  )}
                </div>

                {user.tipoUsuario === "ADMIN" || user.tipoUsuario === "SUPER" ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden md:flex"
                    onClick={() => navigate(user.tipoUsuario === "SUPER" ? "/super-admin" : "/admin-dashboard")}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden md:flex"
                    onClick={() => navigate("/user/request-status")}
                  >
                    Meu Status
                  </Button>
                )}

                <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>

                <Button variant="hero" size="sm" onClick={handleCreateEvent}>
                  Criar Evento
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="hidden md:flex" asChild>
                  <a href="/login">
                    <User className="w-4 h-4 mr-2" />
                    Entrar
                  </a>
                </Button>

                <Button variant="outline" size="sm" className="md:hidden" asChild>
                  <a href="/login">
                    <User className="w-4 h-4 mr-2" />
                    Entrar
                  </a>
                </Button>

                <Button variant="hero" size="sm" className="hidden md:flex" onClick={handleCreateEvent}>
                  Criar Evento
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
