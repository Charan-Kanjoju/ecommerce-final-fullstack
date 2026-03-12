import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../api/client";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data;
    },
  });

  const { data: orders } = useQuery({
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

  const mutation = useMutation({
    mutationFn: async () => {
      await api.put("/user/profile", { name });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          Loading profile...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* PROFILE HEADER */}
        <div className="bg-white border rounded-xl shadow-sm p-8 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold">
            {profile.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <p className="text-gray-500">{profile.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ACCOUNT STATS */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-2xl font-bold">{orders?.length || 0}</p>
          </div>

          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <p className="text-gray-500 text-sm">Account Status</p>
            <p className="font-semibold text-green-600">Active</p>
          </div>

          <div className="border rounded-xl p-6 bg-white shadow-sm">
            <p className="text-gray-500 text-sm">Member Since</p>
            <p className="font-semibold">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* PROFILE DETAILS */}
        <div className="bg-white border rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Profile Details</h2>

          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                value={profile.email}
                disabled
                className="w-full border p-3 rounded-lg bg-gray-100 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              onClick={() => mutation.mutate()}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              {mutation.isPending ? "Updating..." : "Update Profile"}
            </button>

            {mutation.isSuccess && (
              <p className="text-green-600 text-sm">
                Profile updated successfully
              </p>
            )}
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white border rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>

            <button
              onClick={() => navigate("/orders")}
              className="text-sm text-blue-600 hover:underline"
            >
              View All Orders
            </button>
          </div>

          {orders?.length === 0 && (
            <p className="text-gray-500">No orders yet</p>
          )}

          <div className="space-y-4">
            {orders?.slice(0, 3).map((order: any) => (
              <div
                key={order.id}
                className="flex justify-between border rounded-lg p-4"
              >
                <div>
                  <p className="font-medium text-sm">
                    Order #{order.id.slice(0, 8)}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">${order.total}</p>

                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
