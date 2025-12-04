import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { listarSolicitacoesPendentesComToken, aprovarSolicitacao, negarSolicitacao, listarAdmins, listarUsuarios, removerAdmin, removerUsuario, excluirEventoQualquer, listarUsuariosExcluidos, listarEventosCancelados, reativarEvento } from "@/api/codechellaApi";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface SolicitacaoPermissao {
  id: number;
  idUsuario: number;
  nomeUsuario?: string;
  emailUsuario?: string;
  motivo?: string;
  status: string;
}

interface Admin {
  id: number;
  nome: string;
  email: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface UsuarioExcluido {
  id: number;
  nome: string;
  email: string;
  dataExclusao?: string;
}

interface EventoCancelado {
  id: number;
  nome: string;
  descricao: string;
  dataEvento: string;
  categoria: string;
  localEvento: string;
}

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoPermissao[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosExcluidos, setUsuariosExcluidos] = useState<UsuarioExcluido[]>([]);
  const [eventosCancelados, setEventosCancelados] = useState<EventoCancelado[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioExcluido | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSolicitacoes, setLoadingSolicitacoes] = useState(false);
  const [tab, setTab] = useState<"solicitacoes" | "admins" | "usuarios" | "excluidos">("solicitacoes");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: "admin" | "usuario"; nome: string } | null>(null);
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false);
  const [eventoToReactivate, setEventoToReactivate] = useState<EventoCancelado | null>(null);

  async function carregarSolicitacoes() {
    if (!user?.token) return;
    setLoadingSolicitacoes(true);
    setSolicitacoes([]);
    try {
      const listener = listarSolicitacoesPendentesComToken(user.token, (data) => {
        setSolicitacoes((prev) => {
          const exists = prev.find((s) => s.id === data.id);
          if (exists) return prev;
          return [...prev, data];
        });
      });
      setTimeout(() => {
        listener.close();
        setLoadingSolicitacoes(false);
      }, 2000);
    } catch (err) {
      setLoadingSolicitacoes(false);
    }
  }

  async function atualizar() {
    if (!user?.token) return;
    setLoadingSolicitacoes(true);
    try {
      if (tab === "solicitacoes") {
        await carregarSolicitacoes();
      } else if (tab === "admins") {
        const data = await listarAdmins(user.token);
        setAdmins(data);
      } else if (tab === "usuarios") {
        const data = await listarUsuarios(user.token);
        setUsuarios(data);
      } else if (tab === "excluidos") {
        const data = await listarUsuariosExcluidos(user.token);
        setUsuariosExcluidos(data);
      }
    } catch (err) {
      // Error handled silently
    } finally {
      setLoadingSolicitacoes(false);
    }
  }

  useEffect(() => {
    if (!user?.id || !user?.token) {
      return;
    }

    carregarSolicitacoes();

    // Carregar admins e usuários uma vez
    listarAdmins(user.token)
      .then(data => setAdmins(data))
      .catch(err => {});

    listarUsuarios(user.token)
      .then(data => setUsuarios(data))
      .catch(err => {});

    listarUsuariosExcluidos(user.token)
      .then(data => setUsuariosExcluidos(data))
      .catch(err => {});
  }, [user?.id, user?.token]);

  async function handleAprovar(id: number) {
    try {
      await aprovarSolicitacao(id, user?.token ?? "", user?.id);
      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      // Error handled silently
    }
  }

  async function handleNegar(id: number) {
    try {
      await negarSolicitacao(id, "", user?.token ?? "", user?.id);
      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      // Error handled silently
    }
  }

  function openDeleteDialog(id: number, type: "admin" | "usuario", nome: string) {
    setItemToDelete({ id, type, nome });
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!itemToDelete) return;
    
    setDeleteDialogOpen(false);
    
    try {
      if (itemToDelete.type === "admin") {
        await removerAdmin(itemToDelete.id, user?.token ?? "");
        setAdmins((prev) => prev.filter((a) => a.id !== itemToDelete.id));
      } else {
        await removerUsuario(itemToDelete.id, user?.token ?? "");
        setUsuarios((prev) => prev.filter((u) => u.id !== itemToDelete.id));
        // Atualizar lista de excluídos
        const excluidos = await listarUsuariosExcluidos(user?.token ?? "");
        setUsuariosExcluidos(excluidos);
      }
      setItemToDelete(null);
    } catch (err: any) {
      setItemToDelete(null);
      alert(`Não foi possível remover ${itemToDelete.type === "admin" ? "o admin" : "o usuário"}.`);
    }
  }

  async function verEventosCancelados(usuario: UsuarioExcluido) {
    try {
      const eventos = await listarEventosCancelados(usuario.id, user?.token ?? "");
      setEventosCancelados(eventos);
      setUsuarioSelecionado(usuario);
    } catch (err) {
      alert("Erro ao carregar eventos cancelados");
    }
  }

  function voltarParaExcluidos() {
    setEventosCancelados([]);
    setUsuarioSelecionado(null);
  }

  function abrirReativarEvento(evento: EventoCancelado) {
    setEventoToReactivate(evento);
    setReactivateDialogOpen(true);
  }

  async function confirmarReativarEvento() {
    if (!eventoToReactivate) return;
    
    setReactivateDialogOpen(false);
    
    try {
      await reativarEvento(eventoToReactivate.id, user?.token ?? "");
      setEventosCancelados((prev) => prev.filter((e) => e.id !== eventoToReactivate.id));
      setEventoToReactivate(null);
      alert("Evento reativado com sucesso! Agora você é o criador deste evento.");
    } catch (err) {
      setEventoToReactivate(null);
      alert("Erro ao reativar evento");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              Painel <span className="text-gradient">Super Admin</span>
            </h1>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Abas */}
            <div className="flex justify-between items-center mb-8 border-b border-border">
              <div className="flex gap-2">
                <button
                  onClick={() => setTab("solicitacoes")}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    tab === "solicitacoes"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Solicitações ({solicitacoes.length})
                </button>
                <button
                  onClick={() => setTab("admins")}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    tab === "admins"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Admins ({admins.length})
                </button>
                <button
                  onClick={() => setTab("usuarios")}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    tab === "usuarios"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Usuários ({usuarios.length})
                </button>
                <button
                  onClick={() => setTab("excluidos")}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    tab === "excluidos"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Usuários Excluídos ({usuariosExcluidos.length})
                </button>
              </div>
              <Button 
                onClick={atualizar} 
                disabled={loadingSolicitacoes}
                variant="outline"
                size="sm"
              >
                {loadingSolicitacoes ? "Carregando..." : "Atualizar"}
              </Button>
            </div>

            {/* Solicita\u00e7\u00f5es Pendentes */}
            {tab === "solicitacoes" && (
              <section className="space-y-4">
                {solicitacoes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhuma solicitação pendente</p>
                ) : (
                  solicitacoes.map((req) => {
                    const nome = req.nomeUsuario || "—";
                    const email = req.emailUsuario || "—";
                    const motivo = (req.motivo || "").trim();
                    return (
                    <div
                      key={req.id}
                      className="bg-card p-6 rounded-lg border border-border/50 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-lg truncate">{nome}</div>
                        <div className="text-sm text-muted-foreground truncate">{email}</div>
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="secondary">Ver motivo</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Motivo da solicitação</DialogTitle>
                              <DialogDescription>
                                {nome ? `${nome} deseja ser admin` : "Solicitação de admin"}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-2 whitespace-pre-wrap text-sm">
                              {motivo || "Sem motivo informado."}
                            </div>
                            <DialogFooter>
                              <div className="flex gap-2 w-full justify-end">
                                <Button onClick={() => handleAprovar(req.id)} className="bg-green-600 hover:bg-green-700">
                                  Aprovar
                                </Button>
                                <Button onClick={() => handleNegar(req.id)} variant="destructive">
                                  Rejeitar
                                </Button>
                              </div>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button onClick={() => handleAprovar(req.id)} className="bg-green-600 hover:bg-green-700">
                          Aprovar
                        </Button>
                        <Button onClick={() => handleNegar(req.id)} variant="destructive">
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                    );
                  })
                )}
              </section>
            )}

            {/* Admins */}
            {tab === "admins" && (
              <section className="space-y-4">
                {admins.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum admin cadastrado</p>
                ) : (
                  admins.map((admin) => (
                    <div key={admin.id} className="bg-card p-6 rounded-lg border border-border/50 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg">{admin.nome}</div>
                        <div className="text-sm text-muted-foreground">{admin.email}</div>
                      </div>
                      <Button
                        onClick={() => openDeleteDialog(admin.id, "admin", admin.nome)}
                        variant="destructive"
                      >
                        Remover
                      </Button>
                    </div>
                  ))
                )}
              </section>
            )}

            {/* Usuários */}
            {tab === "usuarios" && (
              <section className="space-y-4">
                {usuarios.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum usuário cadastrado</p>
                ) : (
                  usuarios.map((usuario) => (
                    <div key={usuario.id} className="bg-card p-6 rounded-lg border border-border/50 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg">{usuario.nome}</div>
                        <div className="text-sm text-muted-foreground">{usuario.email}</div>
                      </div>
                      <Button
                        onClick={() => openDeleteDialog(usuario.id, "usuario", usuario.nome)}
                        variant="destructive"
                      >
                        Remover
                      </Button>
                    </div>
                  ))
                )}
              </section>
            )}

            {/* Usuários Excluídos */}
            {tab === "excluidos" && !usuarioSelecionado && (
              <section className="space-y-4">
                {usuariosExcluidos.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum usuário excluído</p>
                ) : (
                  usuariosExcluidos.map((usuario) => (
                    <div 
                      key={usuario.id} 
                      className="bg-card p-6 rounded-lg border border-border/50 flex justify-between items-center cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => verEventosCancelados(usuario)}
                    >
                      <div>
                        <div className="font-bold text-lg flex items-center gap-2">
                          {usuario.nome}
                          <Badge variant="destructive">Excluído</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{usuario.email}</div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          verEventosCancelados(usuario);
                        }}
                      >
                        Ver Eventos Cancelados
                      </Button>
                    </div>
                  ))
                )}
              </section>
            )}

            {/* Eventos Cancelados do Usuário Selecionado */}
            {tab === "excluidos" && usuarioSelecionado && (
              <section className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Button onClick={voltarParaExcluidos} variant="outline">
                    ← Voltar
                  </Button>
                  <div>
                    <h2 className="text-2xl font-bold">Eventos Cancelados</h2>
                    <p className="text-muted-foreground">
                      Usuário: {usuarioSelecionado.nome}
                    </p>
                  </div>
                </div>

                {eventosCancelados.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum evento cancelado</p>
                ) : (
                  eventosCancelados.map((evento) => (
                    <div 
                      key={evento.id} 
                      className="bg-card p-6 rounded-lg border border-border/50 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => abrirReativarEvento(evento)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-bold text-lg flex items-center gap-2 mb-2">
                            {evento.nome}
                            <Badge variant="secondary">{evento.categoria}</Badge>
                            <Badge variant="outline">Cancelado</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{evento.descricao}</p>
                          <div className="flex gap-4 text-sm">
                            <span>📍 {evento.localEvento}</span>
                            <span>📅 {new Date(evento.dataEvento).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirReativarEvento(evento);
                          }}
                        >
                          Reativar Evento
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover {itemToDelete?.type === "admin" ? "o admin" : "o usuário"} <strong>{itemToDelete?.nome}</strong>? Os eventos criados por este usuário serão cancelados e apenas você (Super Admin) poderá visualizá-los e reativá-los.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={reactivateDialogOpen} onOpenChange={setReactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reativar Evento</AlertDialogTitle>
            <AlertDialogDescription>
              Gostaria de reativar o evento <strong>{eventoToReactivate?.nome}</strong>? 
              Ao confirmar, o evento voltará a ser exibido para todos os usuários e você se tornará o criador do evento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarReativarEvento} className="bg-green-600 hover:bg-green-700">
              Sim, Reativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
