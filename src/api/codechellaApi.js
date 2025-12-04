const BASE_URL = "https://codechella-backend.onrender.com";

export function buildHeaders(token, extraHeaders = {}) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...extraHeaders
  };
}

export function startKeepAlive() {
  return () => {};
}

function connectSSE(url, onMessage) {
  const eventSource = new EventSource(url);
  eventSource.onmessage = (event) => {
    try {
      onMessage(JSON.parse(event.data));
    } catch {}
  };
  eventSource.onerror = (err) => {
    // SSE error handled silently
  };
  return eventSource;
}

export function listarEventosSSE(callback) {
  return connectSSE(`${BASE_URL}/eventos`, callback);
}

export function listarEventosPorCategoriaSSE(tipo, callback) {
  return connectSSE(`${BASE_URL}/eventos/categoria/${tipo}`, callback);
}

export async function buscarEventoPorId(id) {
  const res = await fetch(`${BASE_URL}/eventos/${id}`);
  return res.json();
}

export async function cadastrarEvento(evento, token) {
  const res = await fetch(`${BASE_URL}/eventos`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(evento)
  });
  return res.json();
}

export async function atualizarEvento(id, evento, token) {
  const res = await fetch(`${BASE_URL}/eventos/${id}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(evento)
  });
  return res.json();
}

export async function excluirEvento(id, token) {
  return fetch(`${BASE_URL}/eventos/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token)
  });
}

export async function cancelarEvento(id, token) {
  const res = await fetch(`${BASE_URL}/eventos/${id}/cancelar`, {
    method: "PATCH",
    headers: buildHeaders(token)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorMsg = "Erro ao cancelar evento";
    try {
      const e = text ? JSON.parse(text) : {};
      errorMsg = e?.message || e?.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  const text = await res.text();
  const result = text ? JSON.parse(text) : {};
  return result;
}

export async function cadastrarIngresso(ingresso, token) {
  const res = await fetch(`${BASE_URL}/ingressos`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(ingresso)
  });
  return res.json();
}

export async function buscarIngressoPorEventoId(eventoId, token) {
  const res = await fetch(`${BASE_URL}/ingressos/evento/${eventoId}`, {
    headers: buildHeaders(token)
  });
  if (!res.ok) return null;
  return res.json();
}

export async function atualizarIngresso(id, ingresso, token) {
  const res = await fetch(`${BASE_URL}/ingressos/${id}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(ingresso)
  });
  return res.json();
}

export function listarIngressosSSE(callback) {
  return connectSSE(`${BASE_URL}/ingressos`, callback);
}

export async function venderIngresso(eventoId, quantidade, token) {
  const res = await fetch(`${BASE_URL}/ingressos/comprar?eventoId=${eventoId}&quantidade=${quantidade}`, {
    method: "POST",
    headers: buildHeaders(token)
  });
  return res.json();
}

export async function cancelarIngresso(id, token) {
  const res = await fetch(`${BASE_URL}/ingressos/Cancelar/${id}`, {
    method: "PUT",
    headers: buildHeaders(token)
  });
  return res.json();
}

export async function cadastrarUsuario(usuario) {
  const res = await fetch(`${BASE_URL}/auth/usuario/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Erro ao cadastrar usuário");
  }

  return res.json();
}

export async function loginUsuario(email, senha) {
  const endpoints = [
    { url: `${BASE_URL}/auth/super-admin/login`, tipo: "SUPER" },
    { url: `${BASE_URL}/auth/admin/login`, tipo: "ADMIN" },
    { url: `${BASE_URL}/auth/usuario/login`, tipo: "USER" }
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(endpoint.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return { ...data, tipoUsuario: data?.tipoUsuario || endpoint.tipo };
      }
    } catch (err) {
      if (err?.name === "AbortError") {
        throw new Error(`Servidor indisponível. Tente novamente.`);
      }
    }
  }

  throw new Error("Email ou senha inválidos");
}

export async function loginSuperAdmin(email, senha) {
  const res = await fetch(`${BASE_URL}/auth/super-admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Erro ao logar como Super Admin");
  }

  return res.json();
}

export async function solicitarPermissaoAdmin(usuarioId, token, motivo = "") {
  const res = await fetch(`${BASE_URL}/permissoes/solicitar`, {
    method: "POST",
    headers: buildHeaders(token, { "usuario-id": usuarioId.toString() }),
    body: JSON.stringify({ motivo })
  });
  if (!res.ok) throw new Error("Erro ao solicitar permissão");
  return res.json();
}

export async function minhasSolicitacoes(usuarioId, token) {
  const res = await fetch(`${BASE_URL}/permissoes/minhas-solicitacoes`, {
    headers: buildHeaders(token, { "usuario-id": usuarioId.toString() })
  });
  if (!res.ok) throw new Error("Erro ao buscar minhas solicitações");
  return res.json();
}

export async function verificarStatusSolicitacao(usuarioId, token) {
  try {
    const res = await fetch(`${BASE_URL}/permissoes/minhas-solicitacoes`, {
      headers: buildHeaders(token, { "usuario-id": usuarioId.toString() })
    });
    
    if (!res.ok) {
      // Se for 401/400 ou qualquer erro, retornar null silenciosamente
      return null;
    }
    
    const solicitacoes = await res.json();
    
    if (Array.isArray(solicitacoes) && solicitacoes.length > 0) {
      const ultima = solicitacoes[solicitacoes.length - 1];
      return { status: ultima.status };
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

export function listarSolicitacoesPendentesComToken(token, callback) {
  if (!token) throw new Error("Token JWT é necessário");

  let stopped = false;
  let es = null;

  function startPolling() {
    async function poll() {
      if (stopped) return;
      try {
        const res = await fetch(`${BASE_URL}/permissoes/pendentes`, {
          headers: buildHeaders(token, { "Accept": "application/json" })
        });

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (Array.isArray(data)) data.forEach(item => callback(item));
        }
      } catch {}
      if (!stopped) setTimeout(poll, 5000);
    }
    poll();
  }

  try {
    const sseUrl = `${BASE_URL}/permissoes/pendentes?token=${encodeURIComponent(token)}`;
    es = new EventSource(sseUrl);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch {}
    };

    es.onerror = () => {
      try { es.close(); } catch {}
      es = null;
      if (!stopped) startPolling();
    };

  } catch {
    startPolling();
  }

  return {
    close() {
      stopped = true;
      try { if (es) es.close(); } catch {}
    }
  };
}

export async function aprovarSolicitacao(id, token, superAdminId) {
  const res = await fetch(`${BASE_URL}/permissoes/${id}/aprovar`, {
    method: "PUT",
    headers: buildHeaders(token, superAdminId ? { "super-admin-id": String(superAdminId) } : {})
  });
  if (!res.ok) throw new Error("Erro ao aprovar");
  return res.json();
}

export async function negarSolicitacao(id, motivo, token, superAdminId) {
  const res = await fetch(`${BASE_URL}/permissoes/${id}/negar?motivo=${encodeURIComponent(motivo)}`, {
    method: "PUT",
    headers: buildHeaders(token, superAdminId ? { "super-admin-id": String(superAdminId) } : {})
  });
  if (!res.ok) throw new Error("Erro ao negar");
  return res.json();
}

export async function sendAdminRequest(payload, token) {
  const res = await fetch(`${BASE_URL}/admin/requests`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const e = await res.json();
    throw new Error(e?.message || "Erro");
  }
  return res.json();
}

export async function getAdminRequests(token) {
  const res = await fetch(`${BASE_URL}/admin/requests`, { headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao buscar solicitações");
  return res.json();
}

export async function approveAdminRequest(id, token) {
  const res = await fetch(`${BASE_URL}/admin/requests/${id}/approve`, { method: "POST", headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao aprovar");
  return res.json();
}

export async function rejectAdminRequest(id, token) {
  const res = await fetch(`${BASE_URL}/admin/requests/${id}/reject`, { method: "POST", headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao rejeitar");
  return res.json();
}

export async function getAllEvents(token) {
  const url = `${BASE_URL}/eventos`;
  const hasToken = Boolean(token);
  
  try {
    const res = await fetch(url, {
      headers: hasToken ? buildHeaders(token) : { "Content-Type": "application/json" }
    });
    const raw = await res.text().catch(() => "");
    
    if (!res.ok) {
      // Se for 401 e não tiver token, retorna array vazio ao invés de erro
      if (res.status === 401 && !hasToken) {
        return [];
      }
      throw new Error(`Erro ao buscar eventos (${res.status})`);
    }
    
    const data = raw ? JSON.parse(raw) : [];
    return data;
  } catch (e) {
    // Se der erro e não tiver token, retorna array vazio
    if (!hasToken) {
      return [];
    }
    throw e;
  }
}

export async function getEventsByCategory(tipo, token) {
  const url = `${BASE_URL}/eventos/categoria/${encodeURIComponent(tipo)}`;
  const hasToken = Boolean(token);
  const res = await fetch(url, {
    headers: hasToken ? buildHeaders(token) : { "Content-Type": "application/json" }
  });
  const raw = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`Erro ao buscar eventos por categoria (${res.status})`);
  }
  try {
    const data = raw ? JSON.parse(raw) : [];
    return data;
  } catch (e) {
    throw e;
  }
}

export async function deleteEvent(id, token) {
  const res = await fetch(`${BASE_URL}/eventos/${id}`, { method: "DELETE", headers: buildHeaders(token) });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.message || "Erro ao deletar evento");
  }
  return res;
}

export async function deleteEventAsAdmin(id, token) {
  const res = await fetch(`${BASE_URL}/usuario/admin/eventos/${id}`, { method: "DELETE", headers: buildHeaders(token) });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.message || "Erro ao deletar evento como admin");
  }
  return res;
}

export async function criarAdmin(adminDTO, token) {
  const res = await fetch(`${BASE_URL}/super-admin/criar/admin`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(adminDTO)
  });
  if (!res.ok) throw new Error("Erro ao criar admin");
  return res.json();
}

export async function listarAdmins(token) {
  const res = await fetch(`${BASE_URL}/super-admin/listar/admins`, {
    headers: buildHeaders(token)
  });
  if (!res.ok) throw new Error("Erro ao listar admins");
  return res.json();
}

export function listarAdminsSSE(callback) {
  return connectSSE(`${BASE_URL}/super-admin/listar/admins`, callback);
}

export async function removerAdmin(id, token) {
  const res = await fetch(`${BASE_URL}/super-admin/remover/admin/${id}`, { method: "DELETE", headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao remover admin");
  return res;
}

export async function listarUsuarios(token) {
  const res = await fetch(`${BASE_URL}/super-admin/listar/usuarios`, {
    headers: buildHeaders(token)
  });
  if (!res.ok) throw new Error("Erro ao listar usuários");
  return res.json();
}

export function listarUsuariosSSE(callback) {
  return connectSSE(`${BASE_URL}/super-admin/listar/usuarios`, callback);
}

export async function removerUsuario(id, token) {
  const res = await fetch(`${BASE_URL}/super-admin/remover/usuario/${id}`, { method: "DELETE", headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao remover usuário");
  return res;
}

export async function excluirEventoQualquer(id, token) {
  const res = await fetch(`${BASE_URL}/super-admin/eventos/${id}`, { method: "DELETE", headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao excluir evento");
  return res;
}

export async function promoverParaAdmin(id, token) {
  const res = await fetch(`${BASE_URL}/super-admin/promover/admin/${id}`, { method: "PUT", headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao promover para admin");
  return res.json();
}

export async function rebaixarParaUser(id, token) {
  const res = await fetch(`${BASE_URL}/super-admin/rebaixar/user/${id}`, { method: "PUT", headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao rebaixar para user");
  return res.json();
}

export async function listarUsuariosExcluidos(token) {
  const res = await fetch(`${BASE_URL}/super-admin/usuarios-excluidos`, { headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao listar usuários excluídos");
  return res.json();
}

export async function listarEventosCancelados(idUsuario, token) {
  const res = await fetch(`${BASE_URL}/super-admin/eventos-cancelados/${idUsuario}`, { headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao listar eventos cancelados");
  return res.json();
}

export async function reativarEvento(idEvento, token) {
  const res = await fetch(`${BASE_URL}/super-admin/reativar-evento/${idEvento}`, { method: "PUT", headers: buildHeaders(token) });
  if (!res.ok) throw new Error("Erro ao reativar evento");
  return res.json();
}
