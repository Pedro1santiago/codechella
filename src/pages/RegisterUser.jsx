import { useState } from "react";
import { cadastrarUsuario } from "../api";

export default function RegisterUser() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const data = await cadastrarUsuario(form);
      setMsg("Usuário cadastrado com sucesso");
    } catch {
      setMsg("Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <h2>Register User</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Name"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="senha"
          placeholder="Password"
          value={form.senha}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}
