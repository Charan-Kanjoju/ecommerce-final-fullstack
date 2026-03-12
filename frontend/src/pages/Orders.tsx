import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Clock3, CreditCard, PackageCheck, Search, Truck } from "lucide-react";
import Layout from "../components/Layout";
import { fetchOrders, type Order, type OrderStatus } from "../services/order.service";
import { OrderStatusTimeline } from "../features/orders/components/OrderStatusTimeline";

type FilterStatus = "ALL" | OrderStatus;

const statusMeta: Record<OrderStatus, { label: string; classes: string }> = {
  PENDING: {
    label: "Placed",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  SHIPPED: {
    label: "Shipped",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  DELIVERED: {
    label: "Delivered",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const summary = (orders: Order[]) => {
  const pending = orders.filter((order) => order.status === "PENDING").length;
  const shipped = orders.filter((order) => order.status === "SHIPPED").length;
  const delivered = orders.filter((order) => order.status === "DELIVERED").length;
  const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);

  return { pending, shipped, delivered, totalSpent };
};

export default function Orders() {
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [search, setSearch] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const stats = useMemo(() => summary(data), [data]);

  const filteredOrders = useMemo(() => {
    return data.filter((order) => {
      const passesStatus = filter === "ALL" || order.status === filter;
      const passesSearch =
        !search ||
        order.fullName.toLowerCase().includes(search.toLowerCase()) ||
        order.items.some((item) => item.product?.name?.toLowerCase().includes(search.toLowerCase()));

      return passesStatus && passesSearch;
    });
  }, [data, filter, search]);

  if (isLoading) {
    return (
      <Layout>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-44 animate-pulse rounded-2xl bg-zinc-200" />
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mb-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Account</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">My Orders</h1>
            <p className="mt-2 text-sm text-zinc-600">Track shipments, view order details, and manage your recent purchases.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or product"
              className="w-full rounded-xl border border-zinc-200 py-2.5 pl-9 pr-3 text-sm outline-none ring-zinc-300 focus:ring"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-zinc-500">
              <Box size={16} />
              <p className="text-xs uppercase tracking-[0.15em]">Total Orders</p>
            </div>
            <p className="text-2xl font-semibold text-zinc-900">{data.length}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-zinc-500">
              <Clock3 size={16} />
              <p className="text-xs uppercase tracking-[0.15em]">Placed</p>
            </div>
            <p className="text-2xl font-semibold text-zinc-900">{stats.pending}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-zinc-500">
              <Truck size={16} />
              <p className="text-xs uppercase tracking-[0.15em]">In Transit</p>
            </div>
            <p className="text-2xl font-semibold text-zinc-900">{stats.shipped}</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-zinc-500">
              <CreditCard size={16} />
              <p className="text-xs uppercase tracking-[0.15em]">Total Spent</p>
            </div>
            <p className="text-2xl font-semibold text-zinc-900">{currency(stats.totalSpent)}</p>
          </div>
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(["ALL", "PENDING", "SHIPPED", "DELIVERED"] as FilterStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition ${
              filter === status
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
            }`}
          >
            {status === "ALL" ? "All Orders" : statusMeta[status].label}
          </button>
        ))}
      </div>

      <section className="space-y-4">
        {filteredOrders.map((order) => {
          const firstItems = order.items.slice(0, 3);

          return (
            <article key={order.id} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-lg md:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-zinc-900">Order for {order.fullName}</p>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${statusMeta[order.status].classes}`}>
                      {statusMeta[order.status].label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                  </p>

                  <div className="mt-4 flex -space-x-3">
                    {firstItems.map((item) => (
                      <img
                        key={item.id}
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="h-11 w-11 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-xs font-medium text-zinc-600">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:text-right">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Total</p>
                  <p className="text-2xl font-semibold text-zinc-900">{currency(order.total)}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-500">
                    <PackageCheck size={14} />
                    {order.paymentMethod} • {order.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                <OrderStatusTimeline status={order.status} />
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-4 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
                <p>
                  Delivering to {order.city}, {order.state}
                </p>
                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex w-fit items-center rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
                >
                  Track & Details
                </Link>
              </div>
            </article>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center">
            <p className="text-sm text-zinc-500">No orders match your current filter.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
