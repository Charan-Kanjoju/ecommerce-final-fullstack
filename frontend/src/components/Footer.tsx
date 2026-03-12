export default function Footer() {
  return (
    <footer className="mt-20 bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-xl font-bold mb-3 tracking-wide">AURORA</h2>
          <p className="text-gray-400">Premium commerce experience.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Products</li>
            <li>Cart</li>
            <li>Orders</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Contact</li>
            <li>Help Center</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
