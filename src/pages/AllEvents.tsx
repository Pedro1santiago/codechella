import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import eventElectronic from "@/assets/event-electronic.jpg";
import eventRock from "@/assets/event-rock.jpg";
import eventJazz from "@/assets/event-jazz.jpg";
import eventHipHop from "@/assets/event-hiphop.jpg";

const AllEvents = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "TODOS", label: "Todos" },
    { id: "SHOW", label: "Shows" },
    { id: "CONCERTO", label: "Concertos" },
    { id: "TEATRO", label: "Teatro" },
    { id: "PALESTRA", label: "Palestras" },
    { id: "WORKSHOP", label: "Workshops" }
  ];

  const allEvents = [
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
    },
    {
      title: "Sinfonia de Verão",
      date: "10 Jan 2025",
      location: "Porto Alegre, RS",
      price: "R$ 200",
      image: eventRock,
      category: "CONCERTO"
    },
    {
      title: "Stand-Up Comedy Night",
      date: "15 Jan 2025",
      location: "Curitiba, PR",
      price: "R$ 80",
      image: eventJazz,
      category: "TEATRO"
    },
    {
      title: "Tech Talk: IA e Futuro",
      date: "20 Jan 2025",
      location: "São Paulo, SP",
      price: "R$ 50",
      image: eventElectronic,
      category: "PALESTRA"
    },
    {
      title: "Workshop de Música Eletrônica",
      date: "25 Jan 2025",
      location: "Rio de Janeiro, RJ",
      price: "R$ 120",
      image: eventHipHop,
      category: "WORKSHOP"
    }
  ];

  const filteredEvents = allEvents.filter(event => {
    const matchesCategory = selectedCategory === "TODOS" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Todos os <span className="text-gradient">Eventos</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore nossa coleção completa de eventos e encontre o perfeito para você
            </p>
          </div>

          {/* Search Bar */}
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

          {/* Category Filters */}
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

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredEvents.map((event, index) => (
                <div
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <EventCard {...event} />
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
    </div>
  );
};

export default AllEvents;
