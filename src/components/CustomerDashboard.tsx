import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Calendar, ArrowRight, MessageSquare } from "lucide-react";
import { ChatBox } from "@/components/ChatBox";

export function CustomerDashboard() {
  const { customer, detailedOrders, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);

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
    <div className="min-h-screen flex">
      {/* Left Section - Keep intact */}
      <div className="flex-1 bg-[#0B1C48] p-12">
        <div className="mb-20">
          <img src="/gokwik-logo-white.svg" alt="GoKwik" className="h-8" />
        </div>
        <div className="text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-8">
            The Only <span className="text-[#F5A623]">D2C</span> Growth Partner You'll Ever Need.
          </h1>
          <div className="space-y-6">
            <div>
              <h3 className="text-[#F5A623] text-xl font-semibold mb-2">Kwik Checkout –</h3>
              <p>Up to 40% conversion uplift with seamless checkout.</p>
            </div>
            <div>
              <h3 className="text-[#F5A623] text-xl font-semibold mb-2">Kwik Pass –</h3>
              <p>Identify 25% of anonymous shoppers and engage with them.</p>
            </div>
            <div>
              <h3 className="text-[#F5A623] text-xl font-semibold mb-2">Kwik Engage –</h3>
              <p>Achieve 20X ROAS with personalized multi-channel engagement.</p>
            </div>
            <div>
              <h3 className="text-[#F5A623] text-xl font-semibold mb-2">Kwik Kart –</h3>
              <p>20% more upsell with smart slide cart customizations.</p>
            </div>
            <div>
              <h3 className="text-[#F5A623] text-xl font-semibold mb-2">Return Prime –</h3>
              <p>Achieve 8% higher revenue from returns and exchanges.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Orders Display */}
      <div className="w-[600px] bg-white p-12 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0B1C48] mb-4">Check Order Status</h1>
          <p className="text-gray-600">
            View status of orders made by {customer.phone} in the last 6 months
          </p>
        </div>

        <div className="space-y-6">
          {detailedOrders.map((order) => (
            <Card key={order.order_number} className="hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {order.items[0]?.image ? (
                      <img 
                        src={order.items[0].image} 
                        alt={order.items[0].name} 
                        className="h-14 w-14 object-contain"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-lg">
                      {order.merchant_name || 'Merchant Name'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Easebuzz | {order.transactions[0]?.payment_id?.substring(0, 12)}...
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.payment_at).toLocaleDateString()} | {new Date(order.payment_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-xl font-bold">
                    ₹{order.total_amount}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`px-4 py-1 rounded-full text-sm font-medium ${
                    order.order_status === "returned"
                      ? "bg-red-100 text-red-800"
                      : order.order_status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.order_status === "confirmed" ? "CONFIRMED" : 
                     order.order_status === "returned" ? "RETURNED" : "NOT CONFIRMED"}
                  </div>
                  {order.refund_status && (
                    <p className="text-sm text-gray-600">
                      Refund {order.refund_status} - Will be processed in 2-3 business days
                    </p>
                  )}
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
        <div className="mt-8">
          {showChat ? (
            <div className="w-full">
              <ChatBox onClose={() => setShowChat(false)} />
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600 mb-4">
                    Need help with your order or refund? Chat with our support bot.
                  </p>
                  <Button
                    className="bg-[#0B1C48] hover:bg-[#162a5c] text-white"
                    onClick={() => setShowChat(true)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
