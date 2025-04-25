import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';

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
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Loading...</h1>
          <p>Please wait while we fetch your information.</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className='flex flex-col'>
        <div>
          <h1 className='text-3xl font-bold mb-4'>My Orders</h1>
          <p className='text-gray-500 mb-3'>
            View status of transactions made by {customer.phone} in the last 6 months
          </p>
        </div>

        <div className='overflow-y-auto p-1 space-y-4' style={{ height: '400px' }}>
          {detailedOrders.map((order) => (
            <Card key={order.order_number} className='hover:shadow-md transition-shadow'>
              <div className='flex flex-col md:flex-row items-start md:items-center p-3 gap-3'>
                <div className='flex items-center gap-3 w-full md:w-auto'>
                  <div className='h-14 w-14 flex-shrink-0 bg-gradient-to-br from-yellow-200 to-blue-400 rounded-md flex items-center justify-center overflow-hidden'>
                    {order.items[0]?.image ? (
                      <img src={order.items[0].image} alt={order.items[0].name} className='h-12 w-12 object-contain' />
                    ) : (
                      <Package className='h-6 w-6 text-blue-900' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h2 className='font-bold text-base truncate'>
                      {order.customer?.name?.split(' ')[0]?.toUpperCase() || 'Unknown Merchant'}
                    </h2>
                    <p className='text-xs text-gray-500 truncate'>
                      {order.payment_method} | {order.transactions[0]?.payment_id}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {new Date(order.payment_at).toLocaleDateString()} |{' '}
                      {new Date(order.payment_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className='ml-auto flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto'>
                  <div className='text-lg font-bold flex-shrink-0'>₹{order.total_amount}</div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      order.order_status === 'confirmed' ||
                      order.order_status === 'delivered' ||
                      order.order_status === 'shipped'
                        ? 'bg-green-100 text-green-800'
                        : order.order_status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.order_status.toUpperCase()}
                  </div>
                  <Button
                    onClick={() => navigate(`/order/${order.order_number}`)}
                    variant='outline'
                    size='sm'
                    className='flex-shrink-0 text-xs w-full md:w-auto'
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
          <h2 className='text-2xl font-bold mb-6'>Need Help?</h2>
          <Card className='p-6'>
            <div className='bg-gray-100 p-4 rounded-lg'>
              <p className='text-center text-gray-600'>
                Need help with your order or refund? Start a conversation with our support bot.
              </p>
              <Button
                className='w-full mt-4 bg-blue-900 hover:bg-blue-800 text-white'
                onClick={() => navigate('/chat')}
              >
                Start Chat
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
