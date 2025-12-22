'use client';

import { useState, useMemo, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import OrderDetailsModal from '@/components/admin/orders/OrderDetailsModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Printer, Download, Eye, Plus, Loader2, Trash2, UploadCloud } from 'lucide-react';

const getOrders = async () => (await api.get('/admin/orders')).data;
const deleteOrderApi = async (id: string) => await api.delete(`/admin/orders/${id}`);

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: orders, isLoading } = useQuery({ queryKey: ['adminOrders'], queryFn: getOrders });
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [deliveryStatus, setDeliveryStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");

  // --- MUTATIONS ---
  const deleteMutation = useMutation({
    mutationFn: deleteOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      alert("Order deleted successfully");
    },
    onError: (error: any) => {
      alert("Failed to delete order");
    }
  });

  // --- ACTIONS ---
  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredOrders) {
      setSelectedRows(filteredOrders.map((o: any) => o.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteSingle = (id: string) => {
    if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
        deleteMutation.mutate(id);
    }
  };

  const handleBulkAction = (value: string) => {
    if (value === 'delete') {
        if (confirm(`Are you sure you want to delete ${selectedRows.length} orders?`)) {
            selectedRows.forEach(id => deleteMutation.mutate(id));
            setSelectedRows([]);
        }
    }
  };

  // Bulk Import
  const handleBulkImportClick = () => fileInputRef.current?.click();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        alert(`File "${file.name}" selected for import. (Backend logic required)`);
        event.target.value = '';
    }
  };

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    if (selectedRows.length === 0) return alert("Select orders to export");
    const selectedData = orders.filter((o: any) => selectedRows.includes(o.id));
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Order ID,Customer,Total,Status\n"
        + selectedData.map((o: any) => `${o.orderId},${o.user?.fullName},${o.totalAmount},${o.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
  };

  // --- FILTER LOGIC ---
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order: any) => {
        const matchesSearch = 
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.phone?.includes(searchTerm);

        const matchesStatus = deliveryStatus === 'all' || order.status === deliveryStatus;
        
        let matchesDate = true;
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        if (dateRange === '7days') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            matchesDate = orderDate >= sevenDaysAgo;
        } else if (dateRange === '30days') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            matchesDate = orderDate >= thirtyDaysAgo;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, deliveryStatus, dateRange]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        processing: "bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]",
        delivered: "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]",
        cancelled: "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]",
        shipped: "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]",
        "order-confirmed": "bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]",
        "in-transit": "bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]",
    };
    const label = status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            {status === 'processing' && <span className="w-2 h-2 rounded-full bg-[#854D0E] animate-pulse"></span>}
            {status === 'delivered' && <span className="text-[10px]">✔</span>}
            {label}
        </span>
    );
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-green-600"/></div>;

  return (
    <div className="space-y-6 font-sans">
      <AdminHeader title="All Orders" subtitle="Every Order Counts" />

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap gap-4 items-center">
                {/* Date Range */}
                <div className="w-40">
                    <p className="text-xs text-gray-500 mb-1 ml-1 font-medium">Date Range</p>
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="7days">Last 7 days</SelectItem>
                            <SelectItem value="30days">Last 30 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* Delivery Status */}
                <div className="w-40">
                    <p className="text-xs text-gray-500 mb-1 ml-1 font-medium">Delivery Status</p>
                    <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-10"><SelectValue placeholder="All Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="order-confirmed">Order Confirmed</SelectItem>
                            <SelectItem value="in-transit">In Transit</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* Payment Status */}
                <div className="w-40">
                    <p className="text-xs text-gray-500 mb-1 ml-1 font-medium">Payment Status</p>
                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-10"><SelectValue placeholder="Select Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Buttons Group */}
            <div className="flex gap-3">
                {/* Hidden Input for Import */}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv,.xlsx" />
                
                <Button variant="outline" onClick={handleBulkImportClick} className="bg-white border-gray-300 text-black hover:bg-gray-50 h-10 px-6 font-medium">
                    <UploadCloud className="mr-2 h-4 w-4" /> Bulk Import
                </Button>
                
                <Link href="/admin/orders/create">
                    <Button className="bg-[#759C5D] hover:bg-[#5e8048] text-white font-semibold h-10 px-6 shadow-md shadow-green-100">
                        <Plus className="mr-2 h-4 w-4" /> Create Order
                    </Button>
                </Link>
            </div>
        </div>
      </div>

      {/* Main Order List Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 pb-4">
            <h3 className="text-xl font-bold text-gray-800">Order list</h3>
            <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                    placeholder="Search by Parcel ID, Name, or Phone..." 
                    className="pl-10 bg-white border-gray-200 h-11 focus-visible:ring-[#759C5D]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedRows.length > 0 && (
            <div className="mx-6 mb-4 bg-[#DCE4D6] p-3 rounded-lg flex justify-between items-center text-[#4A643B] px-6 animate-in fade-in slide-in-from-top-2 border border-[#C5D6BC]">
                <span className="font-semibold">{selectedRows.length} Orders Selected</span>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={handlePrint} className="bg-white border-none text-gray-700 hover:bg-gray-50 h-9 shadow-sm"><Printer className="mr-2 h-4 w-4" /> Invoice Print</Button>
                    <Button variant="outline" size="sm" onClick={handleExportCSV} className="bg-white border-none text-gray-700 hover:bg-gray-50 h-9 shadow-sm"><Download className="mr-2 h-4 w-4" /> Export(CSV)</Button>
                    <Select onValueChange={handleBulkAction}>
                        <SelectTrigger className="h-9 bg-white border-none min-w-[130px] shadow-sm text-gray-700"><SelectValue placeholder="Bulk Action" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="delete" className="text-red-600 focus:text-red-600 focus:bg-red-50">Delete Selected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        )}

        <Table>
            <TableHeader className="bg-[#759C5D]">
                <TableRow className="hover:bg-[#759C5D] border-b-0">
                    <TableHead className="w-12 text-white">
                        <Checkbox 
                            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#759C5D]" 
                            checked={selectedRows.length === filteredOrders.length && filteredOrders.length > 0}
                            onCheckedChange={handleSelectAll}
                        />
                    </TableHead>
                    <TableHead className="text-white font-semibold h-12">Order ID</TableHead>
                    <TableHead className="text-white font-semibold h-12">Customer Info</TableHead>
                    <TableHead className="text-white font-semibold h-12">Date</TableHead>
                    <TableHead className="text-white font-semibold h-12">Total</TableHead>
                    <TableHead className="text-white font-semibold h-12">Status</TableHead>
                    <TableHead className="text-white font-semibold h-12 text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredOrders.length > 0 ? filteredOrders.map((order: any) => (
                    <TableRow key={order.id} className={`hover:bg-gray-50 transition-colors ${selectedRows.includes(order.id) ? 'bg-green-50' : ''}`}>
                        <TableCell><Checkbox checked={selectedRows.includes(order.id)} onCheckedChange={() => toggleRow(order.id)} /></TableCell>
                        <TableCell className="font-medium text-gray-600">#{order.orderId}</TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900">{order.user?.fullName}</span>
                                <span className="text-xs text-gray-500">{order.shippingAddress?.district}</span>
                                <span className="text-xs text-gray-400">{order.user?.phone}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900">৳ {order.totalAmount}</span>
                                <div className="text-[10px] text-gray-400 flex flex-col">
                                    <span>Charge: ৳ {order.deliveryCharge}</span>
                                    {Number(order.walletDiscount) > 0 && <span className="text-green-600">Discount: ৳ {order.walletDiscount}</span>}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell className="text-center">
                            <div className="flex justify-center gap-1">
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#759C5D] hover:bg-green-50" onClick={() => handleViewOrder(order)}>
                                    <Eye size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDeleteSingle(order.id)}>
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No orders found matching your search.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Showing <span className="font-bold text-gray-900">1 - {filteredOrders.length}</span> of <span className="font-bold text-gray-900">{filteredOrders.length}</span> Parcels</span>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500" disabled>Previous</Button>
                <Button size="sm" className="bg-[#759C5D] hover:bg-[#64864e] h-8 w-8 p-0">1</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>
                <Button variant="ghost" size="sm" className="text-gray-500">Next</Button>
            </div>
        </div>
      </div>

      <OrderDetailsModal order={selectedOrder} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}