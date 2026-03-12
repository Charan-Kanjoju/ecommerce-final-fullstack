import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { registerUser } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await registerUser({ name, email, password });
      setAuth({ accessToken: response.accessToken, user: response.user });
      navigate("/products");
    } catch {
      setError("Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto mt-10 max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Create account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Join Aurora</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
