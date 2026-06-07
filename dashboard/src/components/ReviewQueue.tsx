"use client";

import { useEffect, useState } from "react";
import { Check, X, AlertTriangle } from "lucide-react";

type ModerationItem = {
  id: string;
  payload: string;
  trackingId: string;
  toxicityScore: number;
  explainingTokens: string;
  createdAt: string;
};

export function ReviewQueue() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/queue");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch queue", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      // Remove item from UI
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to submit action", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading queue...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-12 border border-gray-800 rounded-lg bg-gray-950">
        <AlertTriangle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-xl font-semibold">Queue is clear!</h2>
        <p className="text-gray-400 mt-2">No pending items for review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="p-6 border border-gray-800 rounded-lg bg-gray-950 shadow-lg flex justify-between items-center transition-all hover:border-gray-700">
          <div className="flex-1 mr-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full font-medium">
                Score: {item.toxicityScore?.toFixed(2) || 'N/A'}
              </span>
              <span className="text-xs text-gray-500">ID: {item.trackingId}</span>
            </div>
            <p className="text-lg font-medium mb-2">{item.payload}</p>
            {item.explainingTokens && (
              <p className="text-sm text-red-400">
                Flagged tokens: {item.explainingTokens}
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleAction(item.id, "ALLOW")}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </button>
            <button
              onClick={() => handleAction(item.id, "BLOCK")}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
