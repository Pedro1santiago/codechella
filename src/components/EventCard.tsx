import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Ticket, X } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  price: string;
  image: string;
  category: string;
  id: string | number;
  onClick?: () => void;
  ingressosDisponiveis?: number;
  canDelete?: boolean;
  onDelete?: (e: React.MouseEvent) => void;
}

export const EventCard = ({ title, date, location, price, image, category, id, onClick, ingressosDisponiveis, canDelete, onDelete }: EventCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 bg-card cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </span>
        </div>
        {canDelete && onDelete && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>
        
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{location}</span>
          </div>
          {typeof ingressosDisponiveis === 'number' && (
            <div className="flex items-center gap-2 text-sm">
              <Ticket className="w-4 h-4 text-primary" />
              <span>{ingressosDisponiveis} ingressos disponíveis</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-display font-bold text-primary">{price}</span>
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          <Button variant="default" size="sm">Comprar</Button>
        </div>
      </div>
    </Card>
  );
};
