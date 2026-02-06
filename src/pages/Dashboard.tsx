import React, { useEffect, useState } from 'react';
import { db } from '../services/storageService';
import { CatalogItem, Batch } from '../types';
import { 
  AlertTriangle, 
  Package, 
  Droplets, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: 'blue' | 'amber' | 'red' | 'green';
}> = ({ title, value, icon: Icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    green: 'bg-green-50 text-green-600 border-green-200',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
          {trend && (
            <p className="flex items-center text-xs font-medium text-green-600 mt-2">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {trend} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalChemicals: 0,
    expiringSoon: 0,
    lowStock: 0,
  });
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const catalog = db.getCatalog();
    const batches = db.getBatches();
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    // Calc Stats
    const expiringSoon = batches.filter(
      b => b.expiryDate && (b.expiryDate - now < thirtyDays) && b.expiryDate > now
    ).length;

    const inventory = db.getInventorySummary();
    const lowStock = inventory.filter(i => (i.totalQuantity || 0) < i.minStockLevel).length;

    // Chart Data
    const cats = catalog.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setCategoryData(Object.entries(cats).map(([name, value]) => ({ name, value })));

    setStats({
      totalItems: catalog.length,
      totalChemicals: catalog.filter(c => c.category === 'CHEMICAL').length,
      expiringSoon,
      lowStock,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Overview of your laboratory inventory.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm text-slate-500">Last updated: Just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Catalog Items" 
          value={stats.totalItems} 
          icon={Package} 
          color="blue"
          trend="+5%"
        />
        <StatCard 
          title="Active Chemicals" 
          value={stats.totalChemicals} 
          icon={Droplets} 
          color="green"
        />
        <StatCard 
          title="Expiring Soon" 
          value={stats.expiringSoon} 
          icon={Clock} 
          color="amber"
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={stats.lowStock} 
          icon={AlertTriangle} 
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Inventory by Category</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={categoryData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   fill="#8884d8"
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {categoryData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-slate-600 capitalize">{entry.name.toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Recent Activity Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-slate-700">Database Integrity</span>
              </div>
              <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">Healthy</span>
            </div>
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-slate-700">Backup Status</span>
              </div>
              <span className="text-xs text-slate-500">Last backup: 2h ago</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <h4 className="text-sm font-semibold text-amber-800 mb-1">Pending Validation</h4>
              <p className="text-xs text-amber-700">3 new batches require QA approval before use.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
