import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music, Calendar, Shield } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import heroImage from "@/assets/hero-festival.jpg";
import eventFallback from "@/assets/event-electronic.jpg";

import { getAllEvents } from "@/api/codechellaApi";
import { useAuth } from "@/context/AuthContext";
import { formatarPreco } from "@/lib/utils";
import EventDetailsDialog from "@/components/EventDetailsDialog";
import { getCustomImage } from "@/lib/imageStorage";
import AdminPromotionModal from "@/components/AdminPromotionModal";
import { useAdminPromotionCheck } from "@/hooks/useAdminPromotionCheck";

// Mapeamento de imagens por categoria com múltiplas opções para shows
const showImages = [
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80"
];

const categoriasImagens: Record<string, string> = {
  SHOW: showImages[0],
  CONCERTO: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80",
  TEATRO: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80",
  PALESTRA: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
  WORKSHOP: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=800&q=80"
};

function getImagemEvento(event: any): string {
  // 1. Verificar se tem imagem customizada no localStorage
  const customImage = getCustomImage(event.id);
  if (customImage) {
    return customImage;
  }
  
  // 2. Verificar se tem imagem do backend
  if (event.imagemUrl || event.imagem) {
    return event.imagemUrl || event.imagem;
  }
  
  // 3. Usar imagem padrão da categoria
  const categoria = (event.categoria || event.tipo || "").toUpperCase();
  
  // Se for SHOW, usar uma imagem variada baseada no ID
  if (categoria === "SHOW" && event.id) {
    return showImages[event.id % showImages.length];
  }
  
  return categoriasImagens[categoria] || eventFallback;
}

const Index = () => {
  const [eventos, setEventos] = useState([]);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;
  const showPromotionModal = useAdminPromotionCheck();

  // ================== CARREGA EVENTOS DO BACK (COM TOKEN SE DISPONÍVEL) ===================
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getAllEvents(user?.token);
        if (!cancelled) {
          const eventosAtivos = Array.isArray(data) ? data.filter(e => e.statusEvento !== "CANCELADO" && e.status !== "CANCELADO") : [];
          setEventos(eventosAtivos);
        }
      } catch (e) {
        if (!cancelled) setEventos([]);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user?.token]);

  function handleEventClick(event: any) {
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    setSelected(event);
    setOpen(true);
  }

  // Calcular eventos da página atual
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventos.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(eventos.length / eventsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ========================= HERO SECTION =========================== */}
      <section className="relative pt-20 md:pt-20 min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage}
            alt="Festival"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-8 animate-fade-in pt-8 md:pt-0">
            <div className="inline-block">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20">
                🎵 Plataforma de Eventos
              </span>
            </div>

            <h1 className="font-display text-6xl md:text-7xl font-black leading-tight">
              Viva a música.
              <br />
              <span className="text-gradient">
                Viva o momento.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              Descubra os melhores eventos, festivais e shows. 
              Compre ingressos de forma rápida, segura e sem complicação.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="hero" size="lg" asChild>
                <a href="/eventos">
                  Explorar Eventos
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>

              <Button variant="outline" size="lg">
                Como Funciona
              </Button>
            </div>

            <div className="flex gap-8 pt-8">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Eventos</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Ingressos</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-primary">30+</div>
                <div className="text-sm text-muted-foreground">Cidades</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== EVENTOS EM DESTAQUE ======================== */}
      <section id="eventos" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">

          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 animate-slide-up">
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Eventos em <span className="text-gradient">Destaque</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Os melhores shows e festivais acontecendo agora
            </p>
          </div>

          {/* Caso ainda não tenha nenhum evento vindo do SSE */}
          {eventos.length === 0 && (
            <p className="text-center text-muted-foreground text-lg">
              Carregando eventos...
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentEvents.map((event, index) => (
              <div 
                key={event.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EventCard
                  title={event.nome}
                  date={event.data}
                  location={event.local}
                  price={`R$ ${formatarPreco(event.preco ?? event.valor)}`}
                  category={event.categoria}
                  image={getImagemEvento(event)}
                  id={event.id}
                  onClick={() => handleEventClick(event)}
                  ingressosDisponiveis={event.ingressosDisponiveis}
                  canDelete={(user?.tipoUsuario === "SUPER") || (user?.tipoUsuario === "ADMIN" && event.idAdminCriador === user?.id)}
                  onDelete={(e) => { e.stopPropagation(); handleEventClick(event); }}
                />
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <a href="/eventos">
                Ver Todos os Eventos
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ====================== CATEGORIAS =========================== */}
      <section id="categorias" className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Explore por <span className="text-gradient">Categoria</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Encontre o tipo de evento perfeito para você
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { id: "SHOW", label: "Shows", emoji: "🎸" },
              { id: "CONCERTO", label: "Concertos", emoji: "🎼" },
              { id: "TEATRO", label: "Teatro", emoji: "🎭" },
              { id: "PALESTRA", label: "Palestras", emoji: "🎤" },
              { id: "WORKSHOP", label: "Workshops", emoji: "🎨" }
            ].map((category, index) => (
              <a
                key={category.id}
                href={`/eventos?categoria=${category.id}`}
                className="group relative bg-card border-2 border-border hover:border-primary rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-glow hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {category.emoji}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {category.label}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== FEATURES =========================== */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Music className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold">Variedade de Eventos</h3>
              <p className="text-muted-foreground">
                Shows, festivais, conferências e muito mais em um só lugar
              </p>
            </div>

            <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold">Compra Rápida</h3>
              <p className="text-muted-foreground">
                Sistema ágil e intuitivo para garantir seu ingresso em segundos
              </p>
            </div>

            <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold">100% Seguro</h3>
              <p className="text-muted-foreground">
                Pagamento protegido e verificação de ingressos garantida
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== FOOTER =========================== */}
      <footer className="py-12 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-white">
                CodeChella
              </span>
            </div>

            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-primary transition-colors">Sobre</a>
              <a href="#" className="hover:text-primary transition-colors">Contato</a>
              <a href="#" className="hover:text-primary transition-colors">Termos</a>
              <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2024 CodeChella. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <EventDetailsDialog
        open={open}
        onOpenChange={setOpen}
        evento={selected ? {
          id: selected.id,
          nome: selected.nome,
          data: selected.data,
          local: selected.local,
          preco: selected.preco ?? selected.valor,
          descricao: selected.descricao,
          imagemUrl: selected.imagemUrl || selected.imagem,
          categoria: selected.categoria,
          idAdminCriador: selected.idAdminCriador,
          criadorNome: selected.criadorNome,
          criadorEmail: selected.criadorEmail,
        } : null}
        onDeleted={(id) => {
          setEventos((prev) => prev.filter(e => e.id !== id));
        }}
      />

      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Necessário</AlertDialogTitle>
            <AlertDialogDescription>
              Você precisa estar logado para ver os detalhes dos eventos e comprar ingressos.
              Deseja fazer login agora?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => window.location.href = "/login"}>
              Ir para Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AdminPromotionModal open={showPromotionModal} />
    </div>
  );
};

export default Index;
