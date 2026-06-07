import { ReviewQueue } from "@/components/ReviewQueue";
import { ActivityFeed } from "@/components/ActivityFeed";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-900 text-white">
      <div className="w-full max-w-7xl font-mono text-sm">
        <h1 className="text-4xl font-bold mb-10 text-center text-blue-400 tracking-tight">Sentinel-AI Command Center</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Human Review Queue */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold mb-2 flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-3 animate-pulse"></span>
              Human Review Queue
            </h2>
            <ReviewQueue />
          </div>

          {/* Right Column: Live Activity Feed */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold mb-2 flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
              Live Event Stream
            </h2>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </main>
  );
}
