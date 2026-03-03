import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-stone-950 font-sans overflow-hidden text-stone-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {/* This is where your dark-themed Recharts will live! */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}