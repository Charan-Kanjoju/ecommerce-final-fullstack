import type { OrderStatus } from "../../../services/order.service";

const STEPS: OrderStatus[] = ["PENDING", "SHIPPED", "DELIVERED"];

type Props = {
  status: OrderStatus;
};

export const OrderStatusTimeline = ({ status }: Props) => {
  const activeIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, idx) => {
        const active = idx <= activeIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${active ? "bg-zinc-900" : "bg-zinc-300"}`}
              aria-hidden="true"
            />
            <span className={`text-[11px] uppercase tracking-[0.15em] ${active ? "text-zinc-800" : "text-zinc-400"}`}>
              {step.toLowerCase()}
            </span>
            {idx < STEPS.length - 1 && <div className={`h-px w-5 ${active ? "bg-zinc-900" : "bg-zinc-300"}`} />}
          </div>
        );
      })}
    </div>
  );
};
