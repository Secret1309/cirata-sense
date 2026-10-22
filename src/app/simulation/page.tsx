import { Header } from '@/components/layout/Header';
import { ControlPanel } from '@/components/simulation/ControlPanel';
import { Dashboard } from '@/components/simulation/Dashboard';

export default function SimulationPage() {
  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-gray-100 text-gray-900">
      <Header />
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <ControlPanel />
        <Dashboard />
      </div>
    </main>
  );
}
