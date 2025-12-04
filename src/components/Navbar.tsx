import { Button } from "@/components/ui/button";
import { Music, Search, User, LogOut, ChevronDown, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { hasPendingSolicitation } from "@/lib/solicitationStorage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      // Redirecionar para página de solicitação
      navigate("/solicitar-admin");
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
            {user ? (
              <>
                {/* Desktop - Botões visíveis */}
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

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden md:flex"
                  onClick={() => {
                    if (user.tipoUsuario === "SUPER") {
                      navigate("/super-admin");
                    } else if (user.tipoUsuario === "ADMIN") {
                      navigate("/admin-dashboard");
                    } else {
                      navigate("/user/request-status");
                    }
                  }}
                >
                  {(user.tipoUsuario === "ADMIN" || user.tipoUsuario === "SUPER") ? "Dashboard" : "Meu Status"}
                </Button>

                <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>

                <Button variant="hero" size="sm" className="hidden md:flex" onClick={handleCreateEvent}>
                  Criar Evento
                </Button>

                {/* Mobile - Dropdown Menu */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="hero" size="sm" className="gap-1">
                        Home
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-auto">
                      <DropdownMenuLabel className="px-3 py-2 cursor-default">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{user.nome || user.email}</span>
                          {user.tipoUsuario === "ADMIN" && (
                            <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded whitespace-nowrap">Admin</span>
                          )}
                          {user.tipoUsuario === "SUPER" && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded whitespace-nowrap">Super</span>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/")}>
                        <Home className="w-4 h-4 mr-2" />
                        Home
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleCreateEvent}>
                        <Music className="w-4 h-4 mr-2" />
                        Criar Evento
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          if (user.tipoUsuario === "SUPER") {
                            navigate("/super-admin");
                          } else if (user.tipoUsuario === "ADMIN") {
                            navigate("/admin-dashboard");
                          } else {
                            navigate("/user/request-status");
                          }
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        {(user.tipoUsuario === "ADMIN" || user.tipoUsuario === "SUPER") ? "Dashboard" : "Meu Status"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => navigate("/login")}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>

                <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => navigate("/login")}>
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>

                <Button variant="outline" size="sm" className="md:hidden" onClick={() => navigate("/login")}>
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
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
