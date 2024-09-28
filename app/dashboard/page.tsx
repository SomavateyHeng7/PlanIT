'use client'

import Sidebar from "@/components/Sidebar";
import DashboardHome from "@/components/DashboardEventList";

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <DashboardHome />
      </div>
    </div>
  );
}