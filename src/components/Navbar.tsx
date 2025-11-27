import { Button } from "@/components/ui/button";
import { Music, Search, User } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient">
              CodeChella
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#eventos" className="text-foreground hover:text-primary transition-colors font-medium">
              Eventos
            </a>
            <a href="#categorias" className="text-foreground hover:text-primary transition-colors font-medium">
              Categorias
            </a>
            <a href="#sobre" className="text-foreground hover:text-primary transition-colors font-medium">
              Sobre
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="hidden md:flex" asChild>
              <a href="/login">
                <User className="w-4 h-4 mr-2" />
                Entrar
              </a>
            </Button>
            <Button variant="hero" size="sm">
              Criar Evento
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
