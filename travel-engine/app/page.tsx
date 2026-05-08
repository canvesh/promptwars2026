"use client";
import { useState } from "react";
import { getTravelResponse } from "./actions/generatePlan";

export default function TravelEngine() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("1000");
  const [itinerary, setItinerary] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInitialPlan = async () => {
    setLoading(true);
    const prompt = `Plan a 3-day trip to ${destination}. Budget: $${budget}. Focus on unique local experiences.`;
    const res = await getTravelResponse(prompt);
    setItinerary(res.text);
    setHistory(res.newHistory);
    setLoading(false);
  };

  const simulateDisruption = async (type: string) => {
    setLoading(true);
    const disruptionPrompts: Record<string, string> = {
      rain: "It just started raining heavily. Reroute the current plan to include indoor activities for the next 4 hours.",
      traffic: "There is a massive traffic gridlock. Suggest a nearby alternative activity or a walking-friendly detour for the current afternoon.",
      budget: "I just lost $200. Adjust the remaining activities to be ultra-budget friendly."
    };
    const res = await getTravelResponse(disruptionPrompts[type], history);
    setItinerary(res.text);
    setHistory(res.newHistory);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-blue-600">VoyageFlow</h1>
          <p className="text-slate-500">AI-Powered Dynamic Travel Intelligence</p>
        </header>

        {/* Search & Constraints Card */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Destination</label>
            <input 
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Where to, Captain?" 
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Budget ($)</label>
            <input 
              type="number" 
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <button 
            onClick={generateInitialPlan}
            disabled={loading || !destination}
            className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? "Calculating Path..." : "Generate Experience Plan"}
          </button>
        </section>

        {/* Output Section */}
        {itinerary && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Itinerary</h2>
              <div className="flex gap-2">
                {/* Disruption Buttons */}
                <button 
                  onClick={() => simulateDisruption('rain')}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
                >
                  🌧️ Simulate Rain
                </button>
                <button 
                  onClick={() => simulateDisruption('traffic')}
                  className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-200 transition"
                >
                  🚗 Traffic Jam
                </button>
              </div>
            </div>
            
            <article className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-blue-500 prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: itinerary.replace(/\n/g, '<br />') }} />
            </article>
          </div>
        )}
      </div>
    </main>
  );
}