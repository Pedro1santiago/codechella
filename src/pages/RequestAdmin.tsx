import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { solicitarPermissaoAdmin } from "@/api/codechellaApi";
import { useNavigate } from "react-router-dom";
import { saveSolicitation } from "@/lib/solicitationStorage";

export default function RequestAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [motivo, setMotivo] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await solicitarPermissaoAdmin(user?.id ?? 0, user?.token ?? "", motivo);
      
      // Salvar solicitação no localStorage
      saveSolicitation(user?.id ?? 0, user?.nome || user?.email || "");
      
      setMsgType("success");
      setMsg("✓ Solicitação enviada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/user/request-status"), 1500);
    } catch (err: any) {
      setMsgType("error");
      setMsg(err.message || "Erro ao enviar solicitação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-12 space-y-2">
              <h1 className="font-display text-4xl md:text-5xl font-bold">
                Solicitar <span className="text-gradient">Admin</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Preencha o formulário para pedir permissão de administrador
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card border border-border/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-2 block">Nome</Label>
                  <Input 
                    value={user?.nome || ""} 
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Email</Label>
                  <Input 
                    value={user?.email || ""} 
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Motivo</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Por que você gostaria de ser um administrador?
                  </p>
                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    rows={5}
                    placeholder="Explique suas razões para querer acesso de administrador..."
                    className="w-full rounded-lg border border-border bg-background text-foreground p-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
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
                    {loading ? "Enviando..." : "Enviar Solicitação"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")}
                    className="flex-1"
                  >
                    Voltar
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
