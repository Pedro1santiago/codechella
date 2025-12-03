import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User } from "lucide-react";
import { cancelarEvento } from "@/api/codechellaApi";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface EventoDetalhe {
  id: number;
  nome: string;
  data: string;
  local: string;
  preco?: number;
  descricao?: string;
  imagemUrl?: string;
  categoria?: string;
  idAdminCriador?: number;
  criadorNome?: string;
  criadorEmail?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  evento: EventoDetalhe | null;
  onDeleted?: (id: number) => void;
}

export default function EventDetailsDialog({ open, onOpenChange, evento, onDeleted }: Props) {
  const { user } = useAuth();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const canSuper = user?.tipoUsuario === "SUPER";
  const canAdminOwner = user?.tipoUsuario === "ADMIN" && evento?.idAdminCriador && user?.id === evento?.idAdminCriador;

  async function handleCancel() {
    if (!evento || !user?.token) return;
    if (!confirm) { setConfirm(true); return; }
    try {
      setLoading(true);
      await cancelarEvento(evento.id, user.token);
      if (onDeleted) onDeleted(evento.id);
      setConfirm(false);
      onOpenChange(false);
      alert("✓ Evento cancelado com sucesso!");
    } catch (e: any) {
      console.error("Erro ao cancelar evento:", e);
      alert("❌ Erro ao cancelar evento: " + (e.message || "Erro desconhecido"));
      setConfirm(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {evento && (
          <div className="space-y-4">
            {evento.imagemUrl && (
              <img src={evento.imagemUrl} alt={evento.nome} className="w-full h-64 object-cover rounded-lg" />
            )}
            
            <DialogHeader>
              <DialogTitle className="text-2xl">{evento.nome}</DialogTitle>
            </DialogHeader>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{evento.data}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{evento.local}</span>
              </div>
              {evento.categoria && (
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
                    {evento.categoria}
                  </span>
                </div>
              )}
            </div>

            {evento.descricao && (
              <p className="text-foreground text-sm whitespace-pre-wrap">{evento.descricao}</p>
            )}

            {canSuper && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50 space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Criado por: {evento.criadorNome || "N/D"} ({evento.criadorEmail || "N/D"})</span>
                </div>
                {typeof evento.idAdminCriador === "number" && (
                  <div className="text-muted-foreground">ID do criador: {evento.idAdminCriador}</div>
                )}
              </div>
            )}

            <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              {!confirm ? (
                <>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
                    <Button variant="default" onClick={() => {
                      // TODO: Implementar compra de ingresso
                      console.log("Comprar ingresso para evento:", evento.id);
                    }}>
                      Comprar Ingresso
                    </Button>
                  </div>
                  
                  {(canSuper || canAdminOwner) && (
                    <Button variant="destructive" onClick={handleCancel} disabled={loading}>
                      Cancelar evento
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex gap-2 w-full justify-between">
                  <Button variant="outline" onClick={() => setConfirm(false)} disabled={loading}>
                    Não
                  </Button>
                  <Button variant="destructive" onClick={handleCancel} disabled={loading}>
                    Sim, cancelar
                  </Button>
                </div>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
