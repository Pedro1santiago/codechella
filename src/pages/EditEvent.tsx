import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { saveCustomImage, getCustomImage } from "@/lib/imageStorage";

export default function EditEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    categoria: "SHOW",
    nome: "",
    data: "",
    local: "",
    preco: "",
    descricao: "",
    imagem: "",
    ingressosDisponiveis: ""
  });
  const [loading, setLoading] = useState(false);
  const [loadingEvento, setLoadingEvento] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    // Carregar dados do evento
    async function loadEvento() {
      try {
        const response = await fetch(`https://codechella-backend.onrender.com/eventos/${id}`, {
          headers: {
            "Authorization": `Bearer ${user?.token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Erro ao carregar evento");

        const evento = await response.json();
        
        // Preencher formulário com dados do evento
        setForm({
          categoria: evento.tipo || evento.categoria || "SHOW",
          nome: evento.nome || "",
          data: evento.data ? formatDateForInput(evento.data) : "",
          local: evento.local || "",
          preco: evento.preco ? evento.preco.toString() : "",
          descricao: evento.descricao || "",
          imagem: getCustomImage(evento.id) || "",
          ingressosDisponiveis: evento.ingressosDisponiveis ? evento.ingressosDisponiveis.toString() : ""
        });
      } catch (err: any) {
        setMsgType("error");
        setMsg(err.message || "Erro ao carregar evento");
      } finally {
        setLoadingEvento(false);
      }
    }

    if (id && user?.token) {
      loadEvento();
    }
  }, [id, user?.token]);

  function formatDateForInput(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const eventoPayload = {
        nome: form.nome,
        data: form.data,
        local: form.local,
        preco: parseFloat(form.preco),
        tipo: form.categoria,
        descricao: form.descricao,
        ingressosDisponiveis: parseInt(form.ingressosDisponiveis)
      };

      const response = await fetch(`https://codechella-backend.onrender.com/eventos/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${user?.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventoPayload)
      });

      if (!response.ok) throw new Error("Erro ao atualizar evento");

      const eventoUpdated = await response.json();

      // Se o usuário forneceu uma URL de imagem customizada, salvar no localStorage
      if (form.imagem) {
        saveCustomImage(parseInt(id!), form.imagem);
      }

      setMsgType("success");
      setMsg("✓ Evento atualizado com sucesso! Redirecionando...");
      setTimeout(() => navigate("/admin-dashboard"), 1500);
    } catch (err: any) {
      setMsgType("error");
      setMsg(err.message || "Erro ao atualizar evento");
    } finally {
      setLoading(false);
    }
  }

  if (loadingEvento) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando evento...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 space-y-2">
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                Editar <span className="text-gradient">Evento</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Atualize os dados do evento
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card border border-border/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Categoria</Label>
                    <select 
                      name="categoria" 
                      value={form.categoria} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="SHOW">Show</option>
                      <option value="CONCERTO">Concerto</option>
                      <option value="TEATRO">Teatro</option>
                      <option value="PALESTRA">Palestra</option>
                      <option value="WORKSHOP">Workshop</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Preço (R$)</Label>
                    <Input 
                      type="number" 
                      name="preco" 
                      value={form.preco} 
                      onChange={handleChange} 
                      placeholder="0.00"
                      step="0.01"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Nome do Evento</Label>
                  <Input 
                    name="nome" 
                    value={form.nome} 
                    onChange={handleChange} 
                    placeholder="Ex: Festival de Música 2024"
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Data e Hora</Label>
                    <Input 
                      type="datetime-local" 
                      name="data" 
                      value={form.data} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Local</Label>
                    <Input 
                      name="local" 
                      value={form.local} 
                      onChange={handleChange} 
                      placeholder="Ex: Estádio Municipal"
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Ingressos Disponíveis</Label>
                    <Input 
                      type="number" 
                      name="ingressosDisponiveis" 
                      value={form.ingressosDisponiveis} 
                      onChange={handleChange}
                      placeholder="Ex: 500"
                      min="1"
                      required 
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">URL da Imagem (Opcional)</Label>
                    <Input 
                      type="url"
                      name="imagem" 
                      value={form.imagem} 
                      onChange={handleChange} 
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Descrição</Label>
                  <textarea 
                    name="descricao" 
                    value={form.descricao} 
                    onChange={handleChange} 
                    rows={4} 
                    placeholder="Descreva o evento..."
                    className="w-full rounded-lg border border-border bg-background text-foreground p-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="pt-2 pb-4 px-4 rounded-lg bg-secondary/20 border border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Editado por:</strong> {user?.nome || user?.email}
                  </p>
                </div>

                {msg && (
                  <div className={`p-4 rounded-lg text-sm font-medium ${
                    msgType === "success" 
                      ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30" 
                      : "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30"
                  }`}>
                    {msg}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => navigate("/admin-dashboard")}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
