import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { loginUser } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      setAuth({ accessToken: response.accessToken, user: response.user });
      navigate("/products");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl md:grid-cols-2">
        <section className="bg-zinc-900 p-8 text-white md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-300">Welcome Back</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">Sign in to continue your shopping journey.</h1>
          <p className="mt-4 text-sm text-zinc-200/90">
            Access your orders, wishlist, and personalized recommendations.
          </p>
        </section>

        <section className="p-8 md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Sign in</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            {error && <p className="text-sm text-zinc-700">{error}</p>}
            <button
              disabled={loading}
              className="w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-5 text-sm text-zinc-600">
            New here? <Link to="/register" className="font-medium text-zinc-900">Create an account</Link>
          </p>
        </section>
      </div>
    </Layout>
  );
}
