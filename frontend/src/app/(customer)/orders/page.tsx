import OrderHistory from "@/components/profile/OrderHistory";

export default function MyOrdersPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-green-900 mb-6">My Orders</h1>
            <p className="text-gray-600 mb-8">See your order history here</p>
            <OrderHistory />
        </div>
    );
}