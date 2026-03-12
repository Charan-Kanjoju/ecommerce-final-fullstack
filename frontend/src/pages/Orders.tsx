import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import Layout from "../components/Layout";

export default function Orders() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh] text-lg font-medium">
          Loading your orders...
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {data?.map((order: any) => (
            <div
              key={order.id}
              className="border rounded-xl shadow-sm hover:shadow-md transition p-6 bg-white"
            >
              {/* Top Section */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium text-gray-800 break-all">
                    {order.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-semibold">${order.total}</p>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium
                    ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Address Section */}
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800 mb-1">
                  Shipping Address
                </p>

                <p>{order.fullName}</p>

                <p>
                  {order.addressLine1}
                  {order.addressLine2 && `, ${order.addressLine2}`}
                </p>

                <p>
                  {order.city}, {order.state} {order.postalCode}
                </p>

                <p>{order.country}</p>

                <p className="mt-2">📞 {order.phone}</p>
              </div>

              {/* Payment Info */}
              <div className="flex justify-between items-center mt-6 text-sm">
                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>

                <div>
                  <p className="text-gray-500">Payment Status</p>
                  <p className="font-medium">{order.paymentStatus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
