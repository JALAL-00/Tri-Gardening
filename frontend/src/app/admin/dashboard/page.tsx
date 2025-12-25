'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, ShoppingCart, Users, Package, AlertCircle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Mock data to match Figma exactly if API is empty
const mockChartData = [
  { day: 'Saturday', revenue: 20 },
  { day: 'Sunday', revenue: 35 },
  { day: 'Monday', revenue: 30 },
  { day: 'Tuesday', revenue: 28 },
  { day: 'Wednesday', revenue: 15 },
  { day: 'Thursday', revenue: 12 },
  { day: 'Friday', revenue: 58 },
];

const getDashboardStats = async () => (await api.get('/admin/dashboard')).data;

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({ queryKey: ['adminDashboard'], queryFn: getDashboardStats });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-green-600"/></div>;

  return (
    <div className="space-y-8 font-sans text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500 text-sm">Overview your business</p>
        </div>
        <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-green-100 text-green-700">AD</AvatarFallback>
        </Avatar>
      </div>

      {/* Stats Cards - Matching Figma Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
            title="Today's Revenue" 
            value={`৳${stats?.totalRevenue || '31900'}`} 
            icon={DollarSign} 
            iconColor="text-green-600" 
            iconBg="bg-green-100" 
            trend="+15.3% from yesterday" 
            trendColor="text-green-600"
        />
        <StatsCard 
            title="Today's Sales" 
            value={stats?.todaysSales || '0'} 
            icon={ShoppingCart} 
            iconColor="text-blue-600" 
            iconBg="bg-blue-100" 
            trend="+8.3% from yesterday" 
            trendColor="text-blue-600"
        />
        <StatsCard 
            title="Total Customer" 
            value={stats?.totalCustomers || '2'} 
            icon={Users} 
            iconColor="text-purple-600" 
            iconBg="bg-purple-100" 
            trend="+24 New Customer Today" 
            trendColor="text-purple-600"
        />
        <StatsCard 
            title="Product Sold" 
            value={stats?.productsSold || '14'} 
            icon={Package} 
            iconColor="text-orange-600" 
            iconBg="bg-orange-100" 
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
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium cursor-pointer shadow-md">Weekly (7 Days)</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-200">Monthly</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.salesGraph?.length ? stats.salesGraph : mockChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#22c55e" 
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
                    {/* Mock Data - In real app, map from stats */}
                    {[
                        { name: "Succulent Collections", sold: 342, img: "/placeholder.svg" },
                        { name: "Organic Fertilizers", sold: 290, img: "/placeholder.svg" },
                        { name: "Garden Tool Sets", sold: 187, img: "/placeholder.svg" },
                        { name: "Tomato Seeds", sold: 156, img: "/placeholder.svg" },
                        { name: "Watering Can", sold: 134, img: "/placeholder.svg" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden relative">
                                {/* Replace with <Image /> in production */}
                                <div className="w-full h-full bg-gray-200" /> 
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.sold} Sold</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
             <Card className="shadow-sm border border-gray-100 h-full bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
                    <ArrowUpRight className="text-gray-400 cursor-pointer hover:text-green-600 transition-colors"/>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-500 bg-[#F9FAFB] uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-3 rounded-l-lg">Order ID</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3 rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">#3847</td>
                                    <td className="px-6 py-4 text-gray-700">Sagorika Islam Alam</td>
                                    <td className="px-6 py-4 font-medium">৳ 2,300</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
                                            Processing
                                        </span>
                                    </td>
                                </tr>
                                {/* Add more rows as needed */}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
             </Card>
          </div>

          {/* Low Stock Alerts */}
          <div>
            <Card className="shadow-sm border border-red-100 h-full bg-[#FEF2F2]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-bold text-red-900">Low Stock Alerts</CardTitle>
                    <AlertCircle className="text-red-500" />
                </CardHeader>
                <CardContent className="space-y-3">
                    {stats?.lowStockAlerts?.length > 0 ? stats.lowStockAlerts.map((item: any) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl border border-red-100 flex justify-between items-center shadow-sm">
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                                <p className="text-xs text-red-500 mt-1 font-medium">{item.stock} left in stock</p>
                            </div>
                            <span className="bg-red-50 text-red-600 text-[10px] uppercase font-bold px-2 py-1 rounded border border-red-100">
                                Critical
                            </span>
                        </div>
                    )) : (
                        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                            <p className="text-sm font-medium text-gray-800">Rose Seeds Premium</p>
                            <p className="text-xs text-red-500 mt-1">Only 3 left in stock</p>
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