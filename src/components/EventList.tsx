import { useEffect, useState } from "react";
import { listarEventosSSE } from "../api/codechellaApi";
import { EventCard } from "./EventCard";

export default function EventList() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const sse = listarEventosSSE((evento) => {
      setEventos((prev) => {
        const exists = prev.some(e => e.id === evento.id);
        if (exists) return prev;
        return [...prev, evento];
      });
    });

    return () => sse.close();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {eventos.map((ev: any) => (
        <EventCard
          key={ev.id}
          title={ev.nome}
          date={ev.data}
          location={ev.local}
          price={`R$ ${ev.preco}`}
          image={ev.imagem}
          category={ev.tipo}
        />
      ))}
    </div>
  );
}
