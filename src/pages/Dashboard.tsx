
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { customer, detailedOrders, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we fetch your information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <img 
            src="https://www.gokwik.co/assets/images/logo@2x.png" 
            alt="GoKwik Logo" 
            className="h-8"
          />
          <div>
            <span className="mr-4">Hello, {customer.name}</span>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Check Payment Status</h1>
        <p className="text-gray-500 mb-8">
          View status of transactions made by {customer.phone} in the last 6 months
        </p>
        
        <div className="space-y-6">
          {detailedOrders.map((order) => (
            <Card key={order.order_number} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center p-6 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="h-16 w-16 bg-gradient-to-br from-yellow-200 to-blue-400 rounded-md flex items-center justify-center overflow-hidden">
                    {order.items[0]?.image ? (
                      <img 
                        src={order.items[0].image} 
                        alt={order.items[0].name} 
                        className="h-14 w-14 object-contain"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-blue-900" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">
                      {order.customer?.name?.split(' ')[0]?.toUpperCase() || 'Unknown Merchant'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {order.payment_method} | {order.transactions[0]?.payment_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.payment_at).toLocaleDateString()} | {new Date(order.payment_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="ml-auto flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="text-xl font-bold">
                    ₹{order.total_amount}
                  </div>
                  <div className={`px-6 py-2 rounded-full text-sm font-medium ${
                    order.order_status === "confirmed" || order.order_status === "delivered" || order.order_status === "shipped"
                      ? "bg-green-100 text-green-800"
                      : order.order_status === "processing" 
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {order.order_status.toUpperCase()}
                  </div>
                  <Button 
                    onClick={() => navigate(`/order/${order.order_number}`)}
                    variant="outline"
                    className="ml-auto"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Chat with us section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Chat with us</h2>
          <Card>
            <CardContent className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-center text-gray-600">
                  Need help with your order or refund? Start a conversation with our support bot.
                </p>
                <Button
                  className="w-full mt-4 bg-blue-900 hover:bg-blue-800 text-white"
                  onClick={() => navigate('/chat')}
                >
                  Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
