import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Calendar, ArrowRight, MessageSquare } from 'lucide-react';
import { ChatBox } from '@/components/ChatBox';

export function CustomerDashboard() {
  const { customer, detailedOrders, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);

  if (!customer) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Loading...</h1>
          <p>Please wait while we fetch your information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left Section - Keep intact */}
      <div className='flex-1 bg-[#0B1C48] p-12'>
        <div className='mb-20'>
          <img src='https://www.gokwik.co/assets/images/logo@2x.png' alt='GoKwik' className='h-8' />
        </div>
        <div className='text-white max-w-2xl'>
          <h1 className='text-5xl font-bold mb-8'>
            The Only <span className='text-[#F5A623]'>D2C</span> Growth Partner You'll Ever Need.
          </h1>
          <div className='space-y-6'>
            <div>
              <h3 className='text-[#F5A623] text-xl font-semibold mb-2'>Kwik Checkout –</h3>
              <p>Up to 40% conversion uplift with seamless checkout.</p>
            </div>
            <div>
              <h3 className='text-[#F5A623] text-xl font-semibold mb-2'>Kwik Pass –</h3>
              <p>Identify 25% of anonymous shoppers and engage with them.</p>
            </div>
            <div>
              <h3 className='text-[#F5A623] text-xl font-semibold mb-2'>Kwik Engage –</h3>
              <p>Achieve 20X ROAS with personalized multi-channel engagement.</p>
            </div>
            <div>
              <h3 className='text-[#F5A623] text-xl font-semibold mb-2'>Kwik Kart –</h3>
              <p>20% more upsell with smart slide cart customizations.</p>
            </div>
            <div>
              <h3 className='text-[#F5A623] text-xl font-semibold mb-2'>Return Prime –</h3>
              <p>Achieve 8% higher revenue from returns and exchanges.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Orders Display */}
      <div className='w-full md:w-[600px] bg-white p-3 md:p-6 flex flex-col h-screen'>
        <div>
          <h1 className='text-3xl font-bold text-[#0B1C48] mb-4'>Check Order Status</h1>
          <p className='text-gray-600'>View status of orders made by {customer.phone} in the last 6 months</p>
        </div>

        <div className='overflow-y-auto p-1 space-y-4' style={{ height: '400px' }}>
          {detailedOrders.map((order) => (
            <Card key={order.order_number} className='hover:shadow-md transition-shadow'>
              <div className='p-3'>
                <div className='flex items-start gap-2 mb-3 flex-wrap md:flex-nowrap'>
                  <div className='h-14 w-14 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden'>
                    {order.items[0]?.image ? (
                      <img src={order.items[0].image} alt={order.items[0].name} className='h-12 w-12 object-contain' />
                    ) : (
                      <Package className='h-6 w-6 text-gray-400' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h2 className='font-bold text-base truncate'>{order.merchant_name || 'Merchant Name'}</h2>
                    <p className='text-xs text-gray-500 truncate'>
                      Easebuzz | {order.transactions[0]?.payment_id?.substring(0, 12)}...
                    </p>
                    <p className='text-xs text-gray-500'>
                      {new Date(order.payment_at).toLocaleDateString()} |{' '}
                      {new Date(order.payment_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className='text-lg font-bold flex-shrink-0'>₹{order.total_amount}</div>
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium inline-block w-fit ${
                      order.order_status === 'returned'
                        ? 'bg-orange-100 text-orange-800'
                        : order.order_status === 'cancelled' ||
                          (order.refunds && order.refunds.length > 0 && order.order_status !== 'returned')
                        ? 'bg-red-100 text-red-800'
                        : order.order_status === 'confirmed' || order.order_status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.order_status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.order_status === 'not_confirmed'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.order_status === 'returned'
                      ? 'RETURNED'
                      : order.order_status === 'cancelled'
                      ? 'CANCELLED'
                      : order.refunds && order.refunds.length > 0 && order.order_status !== 'returned'
                      ? 'REFUNDED'
                      : order.order_status === 'confirmed'
                      ? 'CONFIRMED'
                      : order.order_status === 'shipped'
                      ? 'SHIPPED'
                      : order.order_status === 'delivered'
                      ? 'DELIVERED'
                      : order.order_status === 'not_confirmed'
                      ? 'NOT CONFIRMED'
                      : 'PROCESSING'}
                  </div>
                  <div className='flex-1 min-w-0'>
                    {order.order_status === 'not_confirmed' && order.payment_status ? (
                      <p className='text-xs text-yellow-700 truncate'>
                        Payment received but order was not confirmed. Refund will be processed automatically.
                      </p>
                    ) : (
                      (order.refund_status || (order.refunds && order.refunds.length > 0)) && (
                        <p className='text-xs text-gray-600 truncate'>
                          Refund{' '}
                          {order.refunds && order.refunds.length > 0
                            ? order.refunds[0].status === 'Success'
                              ? 'processed'
                              : 'initiated'
                            : order.refund_status}{' '}
                          - Will be credited to your account within{' '}
                          {order.refunds && order.refunds.length > 0 && order.refunds[0].status === 'Success'
                            ? '2-3'
                            : '3-5'}{' '}
                          business days. Please check your bank statement.
                        </p>
                      )
                    )}
                  </div>
                  <Button
                    onClick={() => navigate(`/order/${order.order_number}`)}
                    variant='outline'
                    size='sm'
                    className='w-full sm:w-auto flex-shrink-0 text-xs'
                  >
                    View Details
                    <ArrowRight className='ml-1 h-3 w-3' />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Chat with us section */}
        <div className='mt-6 flex-shrink-0'>
          {showChat ? (
            <div className='w-full'>
              <ChatBox onClose={() => setShowChat(false)} />
            </div>
          ) : (
            <Card>
              <CardContent className='p-6'>
                <div className='bg-gray-50 p-4 rounded-lg text-center'>
                  <p className='text-gray-600 mb-4'>Need help with your order or refund? Chat with our support bot.</p>
                  <Button className='bg-[#0B1C48] hover:bg-[#162a5c] text-white' onClick={() => setShowChat(true)}>
                    <MessageSquare className='mr-2 h-4 w-4' />
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
