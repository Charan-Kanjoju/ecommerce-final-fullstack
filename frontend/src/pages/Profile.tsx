import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import Layout from "../components/Layout";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function Profile() {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data;
    },
  });

  const { data: orders = [] } = useQuery<any[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data;
    },
  });

  const [name, setName] = useState("");

  useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile]);

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders],
  );

  const mutation = useMutation({
    mutationFn: async () => {
      await api.put("/user/profile", { name });
    },
  });

  if (isLoading || !profile) {
    return (
      <Layout>
        <div className="h-56 animate-pulse rounded-3xl bg-zinc-200" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="bg-zinc-900 p-8 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">My Account</p>
            <h1 className="mt-2 text-3xl font-semibold">Welcome, {profile.name}</h1>
            <p className="mt-2 text-sm text-zinc-200/90">Manage profile details, track purchases, and monitor your shopping activity.</p>
          </div>
          <div className="flex items-center gap-5 p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-3xl font-bold text-white">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-semibold text-zinc-900">{profile.name}</p>
              <p className="text-sm text-zinc-500">{profile.email}</p>
              <p className="mt-1 text-xs text-zinc-400">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Total Orders</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Total Spent</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Status</p>
            <p className="mt-2 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700">Active</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Profile Details</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm text-zinc-500">Email</label>
                <input value={profile.email} disabled className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-100 p-3" />
              </div>

              <div>
                <label className="text-sm text-zinc-500">Full Name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-200 p-3 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <button
                onClick={() => mutation.mutate()}
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white"
              >
                {mutation.isPending ? "Updating..." : "Save changes"}
              </button>

              {mutation.isSuccess && <p className="text-sm text-zinc-700">Profile updated successfully.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">Recent Orders</h3>
              <button onClick={() => navigate("/orders")} className="text-sm font-medium text-zinc-900">
                View all
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-sm text-zinc-500">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 4).map((order: any) => (
                  <div key={order.id} className="rounded-xl border border-zinc-200 p-4">
                    <p className="text-sm font-medium text-zinc-900">Order for {order.fullName}</p>
                    <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-zinc-900">${Number(order.total).toFixed(2)}</p>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
