import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import EventDetailsDialog from "@/components/EventDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getAllEvents } from "@/api/codechellaApi";
import { useAuth } from "@/context/AuthContext";
import { formatarPreco } from "@/lib/utils";
import eventFallback from "@/assets/event-electronic.jpg";
import { getCustomImage } from "@/lib/imageStorage";
import AdminPromotionModal from "@/components/AdminPromotionModal";
import { useAdminPromotionCheck } from "@/hooks/useAdminPromotionCheck";
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

interface EventoDTO {
  id: number;
  nome: string;
  data: string;
  local: string;
  preco?: number;
  valor?: number;
  categoria: string;
  imagemUrl?: string;
  ingressosDisponiveis?: number;
  idAdminCriador?: number;
}

const AllEvents = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [eventos, setEventos] = useState<EventoDTO[]>([]);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const showPromotionModal = useAdminPromotionCheck();

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

  const categories = [
    { id: "TODOS", label: "Todos" },
    { id: "SHOW", label: "Shows" },
    { id: "CONCERTO", label: "Concertos" },
    { id: "TEATRO", label: "Teatro" },
    { id: "PALESTRA", label: "Palestras" },
    { id: "WORKSHOP", label: "Workshops" }
  ];

  const filteredEvents = eventos.filter((event) => {
    const categoria = (event.categoria || (event as any).tipo || "").toUpperCase();
    const matchesCategory = selectedCategory === "TODOS" || categoria === selectedCategory;
    const matchesSearch =
      (event.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.local || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">

          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Todos os <span className="text-gradient">Eventos</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore nossa coleção completa de eventos e encontre o perfeito para você
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar eventos por nome ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-base"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all"
              >
                {category.label}
              </Button>
            ))}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <EventCard
                    title={event.nome}
                    date={event.data}
                    location={event.local}
                    price={`R$ ${formatarPreco(event.preco ?? event.valor)}`}
                    image={getImagemEvento(event)}
                    category={(event.categoria || (event as any).tipo || "").toString()}
                    id={event.id}
                    onClick={() => handleEventClick(event)}
                    ingressosDisponiveis={event.ingressosDisponiveis}
                    canDelete={(user?.tipoUsuario === "SUPER") || (user?.tipoUsuario === "ADMIN" && event.idAdminCriador === user?.id)}
                    onDelete={(e) => { e.stopPropagation(); handleEventClick(event); }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                Nenhum evento encontrado para os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </div>

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
          imagemUrl: selected.imagemUrl,
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

export default AllEvents;
