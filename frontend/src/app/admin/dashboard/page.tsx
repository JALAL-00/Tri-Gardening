'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, ShoppingCart, Users, Package, AlertCircle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader'; // <--- IMPORT THIS

const getDashboardStats = async () => (await api.get('/admin/dashboard')).data;

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({ queryKey: ['adminDashboard'], queryFn: getDashboardStats });

  const constructImageUrl = (path: string) => {
    if (!path || path === '/placeholder.svg') return '/placeholder.svg';
    return `http://localhost:5005${path}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'processing': return 'bg-[#FEF9C3] text-[#854D0E]';
        case 'delivered': return 'bg-[#DCFCE7] text-[#166534]';
        case 'cancelled': return 'bg-[#FEE2E2] text-[#991B1B]';
        case 'shipped': return 'bg-[#DBEAFE] text-[#1E40AF]';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-green-600"/></div>;

  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      {/* --- HERE IS THE CHANGE --- */}
      {/* We removed the long <div> code and used this single line instead */}
      <AdminHeader title="Dashboard" subtitle="Overview your business" />
      {/* ------------------------- */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
            title="Today's Revenue" 
            value={`৳${stats?.totalRevenue.toLocaleString() || '0'}`} 
            icon={DollarSign} 
            iconColor="text-[#16a34a]" 
            iconBg="bg-[#dcfce7]" 
            trend="+15.3% from yesterday" 
            trendColor="text-green-600"
        />
        <StatsCard 
            title="Today's Sales" 
            value={stats?.todaysSales || '0'} 
            icon={ShoppingCart} 
            iconColor="text-[#2563eb]" 
            iconBg="bg-[#dbeafe]" 
            trend="+8.3% from yesterday" 
            trendColor="text-blue-600"
        />
        <StatsCard 
            title="Total Customer" 
            value={stats?.totalCustomers || '0'} 
            icon={Users} 
            iconColor="text-[#9333ea]" 
            iconBg="bg-[#f3e8ff]" 
            trend="+24 New Customer Today" 
            trendColor="text-purple-600"
        />
        <StatsCard 
            title="Product Sold" 
            value={stats?.productsSold || '0'} 
            icon={Package} 
            iconColor="text-[#ea580c]" 
            iconBg="bg-[#ffedd5]" 
            trend="+24 New Customer Today" 
            trendColor="text-orange-600"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Chart */}
        <Card className="lg:col-span-2 shadow-sm border border-gray-100 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Sales over the days</CardTitle>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#5A8743] text-white rounded-full text-xs font-medium cursor-pointer shadow-md">Weekly (7 Days)</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-200">Monthly</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.salesGraph || []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeDashoffset={4} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#5A8743" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="shadow-sm border border-gray-100 bg-white">
            <CardHeader className="pb-4"><CardTitle className="text-lg font-bold">Your Top Selling Products</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {stats?.topSelling?.length > 0 ? stats.topSelling.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                                <Image src={constructImageUrl(item.image)} alt={item.name} fill className="object-cover" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.sold} Sold</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-sm text-center py-4">No sales data yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
             <Card className="shadow-sm border border-gray-100 h-full bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
                    <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
                    <ArrowUpRight className="text-gray-400 cursor-pointer hover:text-green-600 transition-colors"/>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#759C5D] text-white uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats?.recentOrders?.length > 0 ? stats.recentOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                                        <td className="px-6 py-4 font-medium">৳{parseFloat(order.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border border-opacity-20 ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-500">No recent orders.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
             </Card>
          </div>

          {/* Low Stock Alerts */}
          <div>
            <Card className="shadow-sm border border-red-100 h-full bg-[#FFFBFB]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-bold text-gray-900">Low Stock Alerts</CardTitle>
                    <AlertCircle className="text-red-500" />
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                    {stats?.lowStockAlerts?.length > 0 ? stats.lowStockAlerts.map((item: any) => (
                        <div key={item.id} className="bg-[#FFE4E6] p-4 rounded-xl border border-red-100 flex justify-between items-center shadow-sm">
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{item.name} ({item.variant})</p>
                                <p className="text-xs text-red-500 mt-1 font-medium">Only {item.stock} left in stock</p>
                            </div>
                            <span className="bg-red-200 text-red-800 text-[10px] uppercase font-bold px-2 py-1 rounded">
                                Critical
                            </span>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No stock alerts. Good job!
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, iconColor, iconBg, trend, trendColor }: any) {
    return (
        <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${iconBg}`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                </div>
                <p className={`text-xs mt-4 font-semibold ${trendColor}`}>{trend}</p>
            </CardContent>
        </Card>
    )
}