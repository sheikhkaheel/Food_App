import { getOrders } from "./actions";
import OrderButton from "./components/order-button";

export default async function App() {
  const posts = await getOrders();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 lg:p-16">
      <header className="max-w-7xl mx-auto mb-16 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
          Daily Specials
        </h1>
        <div className="h-1 w-20 bg-indigo-500 rounded-full" />
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts?.map((food) => (
          <div
            key={food.id}
            className="group relative bg-[#141414] border border-zinc-800/50 rounded-3xl overflow-hidden transition-all duration-500 hover:border-indigo-500/50"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                src={food?.img}
                alt={food?.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-4 left-5">
                <span className="text-2xl font-black text-white tracking-tight">
                  {food.amount}
                  <span className="text-indigo-400 text-sm ml-1 uppercase">
                    {food.currency}
                  </span>
                </span>
              </div>
            </div>

            <div className="p-6 pt-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2 group-hover:text-indigo-400 transition-colors">
                  {food?.name}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Experience a blend of seasonal flavors crafted by our top
                  chefs.
                </p>
              </div>

              <div className="relative group/btn">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover/btn:opacity-100 transition duration-1000"></div>
                <div className="relative">
                  <OrderButton food={food} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
