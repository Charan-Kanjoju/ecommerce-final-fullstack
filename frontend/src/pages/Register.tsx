import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl md:grid-cols-2">
        <section className="bg-zinc-900 p-8 text-white md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-300">Join Aurora</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">Create your account and unlock a premium shopping experience.</h1>
          <p className="mt-4 text-sm text-zinc-200/90">
            Track every order, save favorites, and enjoy faster checkout.
          </p>
        </section>

        <section className="p-8 md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Create account</h2>
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
            {error && <p className="text-sm text-zinc-700">{error}</p>}
            <button
              disabled={loading}
              className="w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
          <p className="mt-5 text-sm text-zinc-600">
            Already have an account? <Link to="/login" className="font-medium text-zinc-900">Sign in</Link>
          </p>
        </section>
      </div>
    </Layout>
  );
}
