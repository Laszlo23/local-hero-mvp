import { ExploreMap } from "@/components/maps/ExploreMap";
import { mockQuests } from "@/lib/mockData";

export default function ExplorePage() {
  return (
    <section className="space-y-4 animate-float-in">
      <h1 className="text-2xl font-bold text-white">Quest Discovery Map</h1>
      <p className="text-sm text-slate-200">
        Explore nearby missions, geofenced AR hunts, and sponsor-backed local challenges.
      </p>
      <ExploreMap quests={mockQuests} />
    </section>
  );
}
