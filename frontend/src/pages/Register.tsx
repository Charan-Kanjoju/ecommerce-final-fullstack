import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { registerUser } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError("");

    try {
      const response = await registerUser({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      });
      setAuth({ accessToken: response.accessToken, user: response.user });
      navigate("/products");
    } catch {
      setError("Unable to create account.");
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
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <div>
              <input
                type="text"
                placeholder="Full name"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3"
                aria-invalid={errors.name ? "true" : "false"}
                {...register("name", {
                  required: "Full name is required.",
                  validate: (value) =>
                    value.trim().length >= 2 || "Full name must be at least 2 characters.",
                })}
              />
              {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name.message}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3"
                aria-invalid={errors.email ? "true" : "false"}
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
              />
              {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3"
                aria-invalid={errors.password ? "true" : "false"}
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters.",
                  },
                  validate: {
                    hasLetter: (value) =>
                      /[A-Za-z]/.test(value) || "Password must include at least one letter.",
                    hasNumber: (value) =>
                      /\d/.test(value) || "Password must include at least one number.",
                  },
                })}
              />
              {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>}
            </div>

            {error && <p className="text-sm text-zinc-700">{error}</p>}

            <button
              disabled={isSubmitting}
              className="w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create account"}
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
