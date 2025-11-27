import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music, Calendar, Shield } from "lucide-react";
import heroImage from "@/assets/hero-festival.jpg";
import eventElectronic from "@/assets/event-electronic.jpg";
import eventRock from "@/assets/event-rock.jpg";
import eventJazz from "@/assets/event-jazz.jpg";
import eventHipHop from "@/assets/event-hiphop.jpg";

const Index = () => {
  const events = [
    {
      title: "Summer Electronic Festival",
      date: "15 Dez 2024",
      location: "São Paulo, SP",
      price: "R$ 180",
      image: eventElectronic,
      category: "SHOW"
    },
    {
      title: "Rock in Rio Experience",
      date: "20 Dez 2024", 
      location: "Rio de Janeiro, RJ",
      price: "R$ 250",
      image: eventRock,
      category: "CONCERTO"
    },
    {
      title: "Jazz & Blues Night",
      date: "28 Dez 2024",
      location: "Belo Horizonte, MG",
      price: "R$ 120",
      image: eventJazz,
      category: "SHOW"
    },
    {
      title: "Urban Beats Festival",
      date: "5 Jan 2025",
      location: "Brasília, DF",
      price: "R$ 150",
      image: eventHipHop,
      category: "SHOW"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage}
            alt="Festival"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-8 animate-fade-in">
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
              <Button variant="hero" size="lg">
                Explorar Eventos
                <ArrowRight className="w-5 h-5" />
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

      {/* Events Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event, index) => (
              <div 
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EventCard {...event} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Ver Todos os Eventos
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

            <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold">Compra Rápida</h3>
              <p className="text-muted-foreground">
                Sistema ágil e intuitivo para garantir seu ingresso em segundos
              </p>
            </div>

            <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
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

      {/* Footer */}
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
    </div>
  );
};

export default Index;
