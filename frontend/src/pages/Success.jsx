import { Link, useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  return (
    <section className="min-h-[60vh] bg-gradient-to-b from-emerald-50 via-white to-amber-50/30">
      <div className="container mx-auto px-4 py-12">
        <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />

          <div className="relative flex flex-col items-center gap-5 px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-emerald-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              Success
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              {Boolean(location?.state?.text) ? location?.state?.text : "Payment"} completed
            </h1>
            <p className="max-w-md text-sm text-slate-600">
              Your order is confirmed and we are preparing it now. You can track it from your dashboard.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-700"
              >
                Go To Home
              </Link>
              <Link
                to="/dashboard/myorders"
                className="rounded-full border border-emerald-200 px-6 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Success;
