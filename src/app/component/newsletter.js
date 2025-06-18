export default function Newsletter() {
  return (
    <div className="mt-8 m-5 text-center">
      <div className="bg-slate-800 rounded-lg p-6">
  <h3 className="text-lg font-semibold mb-2">🌊 DIVE INTO OUR NEWSLETTER</h3>
  <p className="text-gray-400 text-sm mb-4">
    Get the latest happenings and esports news about and from LSB Sharks Unlimited.
  </p>
  <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
    <input
      type="email"
      placeholder="Enter your email"
      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-shark-blue"
    />
    <button className="bg-shark-blue hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
      Subscribe
    </button>
  </div>
</div>
        </div>
  )
}
