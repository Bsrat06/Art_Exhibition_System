export default function Home() {
  return (
    <div className="space-y-6">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Visual Arts Club 🎨</h1>
        <p className="text-lg text-muted-foreground">Inspiring creativity. Connecting artists.</p>
      </section>

      <section className="py-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Featured Artwork</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="h-40 bg-gray-200 rounded-lg">Artwork 1</div>
          <div className="h-40 bg-gray-200 rounded-lg">Artwork 2</div>
          <div className="h-40 bg-gray-200 rounded-lg">Artwork 3</div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">🎭 Art Exhibition - July 5</div>
          <div className="p-4 border rounded-lg">🎨 Live Painting - July 12</div>
        </div>
      </section>
    </div>
  )
}
