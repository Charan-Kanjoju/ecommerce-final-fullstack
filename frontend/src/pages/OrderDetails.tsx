import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { fetchOrderById } from "../services/order.service";
import { OrderStatusTimeline } from "../features/orders/components/OrderStatusTimeline";

export default function OrderDetails() {
  const { id = "" } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id),
    enabled: Boolean(id),
  });

  if (isLoading || !order) {
    return (
      <Layout>
        <div className="h-48 animate-pulse rounded-2xl bg-zinc-200" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <header className="rounded-3xl border border-zinc-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Order</p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">{order.id}</h1>
          <p className="mt-2 text-sm text-zinc-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          <div className="mt-4">
            <OrderStatusTimeline status={order.status} />
          </div>
        </header>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-zinc-900">{item.product?.name}</p>
                  <p className="text-sm text-zinc-500">Qty {item.quantity}</p>
                </div>
                <p className="font-medium text-zinc-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500">Shipping</h3>
            <p className="text-sm text-zinc-700">{order.fullName}</p>
            <p className="text-sm text-zinc-700">{order.addressLine1}</p>
            {order.addressLine2 && <p className="text-sm text-zinc-700">{order.addressLine2}</p>}
            <p className="text-sm text-zinc-700">{order.city}, {order.state} {order.postalCode}</p>
            <p className="text-sm text-zinc-700">{order.country}</p>
            <p className="mt-2 text-sm text-zinc-700">{order.phone}</p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500">Payment</h3>
            <p className="text-sm text-zinc-700">Method: {order.paymentMethod}</p>
            <p className="text-sm text-zinc-700">Status: {order.paymentStatus}</p>
            <p className="mt-3 text-lg font-semibold text-zinc-900">Total: ${order.total.toFixed(2)}</p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
