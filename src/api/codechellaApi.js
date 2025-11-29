const BASE_URL = "https://codechella-backend.onrender.com";

function connectSSE(url, onMessage) {
  const eventSource = new EventSource(url);
  eventSource.onmessage = (event) => {
    try {
      onMessage(JSON.parse(event.data));
    } catch {}
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

export async function cadastrarEvento(evento, adminId) {
  const res = await fetch(`${BASE_URL}/eventos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "admin-id": adminId
    },
    body: JSON.stringify(evento)
  });
  return res.json();
}

export async function atualizarEvento(id, evento, adminId) {
  const res = await fetch(`${BASE_URL}/eventos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "admin-id": adminId
    },
    body: JSON.stringify(evento)
  });
  return res.json();
}

export async function excluirEvento(id, adminId) {
  return fetch(`${BASE_URL}/eventos/${id}`, {
    method: "DELETE",
    headers: { "admin-id": adminId }
  });
}

export async function cadastrarIngresso(ingresso) {
  const res = await fetch(`${BASE_URL}/ingressos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingresso)
  });
  return res.json();
}

export function listarIngressosSSE(callback) {
  return connectSSE(`${BASE_URL}/ingressos`, callback);
}

export async function venderIngresso(eventoId, quantidade) {
  const res = await fetch(
    `${BASE_URL}/ingressos/comprar?eventoId=${eventoId}&quantidade=${quantidade}`,
    { method: "POST" }
  );
  return res.json();
}

export async function cancelarIngresso(id) {
  const res = await fetch(`${BASE_URL}/ingressos/Cancelar/${id}`, {
    method: "PUT"
  });
  return res.json();
}



export async function cadastrarUsuario(usuario) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  });
  return res.json();
}

export async function loginUsuario(email, senha) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: senha })
  });
  return res.json();
}
