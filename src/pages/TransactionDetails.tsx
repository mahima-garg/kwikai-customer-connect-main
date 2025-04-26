import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck, Package } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const reasonOptions = ['Refund Status', 'Refund Not Credited', 'Order Status', 'Amount Debited Order Not Confirmed'];

const issueOptions = {
  'Refund Status': ['Need ARN number', 'Refund timeline query', 'Refund status check', 'Others'],
  'Refund Not Credited': ['Bank statement verification', 'Payment gateway issue', 'Delayed refund', 'Others'],
  'Order Status': ['Where is my order', 'Order delayed', 'Wrong order delivered', 'Others'],
  'Amount Debited Order Not Confirmed': [
    'Transaction failed after payment',
    'Double payment',
    'Payment stuck',
    'Others',
  ],
};

const TransactionDetails = () => {
  const { orderId } = useParams();
  const { detailedOrders, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reason, setReason] = useState<string>('');
  const [issueType, setIssueType] = useState<string>('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const order = detailedOrders.find((o) => o.order_number === orderId);

  if (!order) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Order Not Found</h1>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const successTransaction = order.transactions.find((t) => t.status === 'success') || order.transactions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      orderId,
      reason,
      issueType,
      description,
    });
    toast({
      title: 'Support ticket created',
      description: "We'll get back to you soon",
    });
    setIsDialogOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'The payment ID has been copied to your clipboard',
    });
  };

  return (
    <AppLayout>
      <div>
        <h1 className='text-3xl font-bold mb-2'>Order Details</h1>
        <p className='text-gray-500 mb-6'>
          Order {order.shopify_order_name} • {order.order_number}
        </p>

        <Tabs defaultValue='details' className='mb-6'>
          <TabsList className='w-full mb-6'>
            <TabsTrigger value='details' className='flex-1'>
              Order Details
            </TabsTrigger>
            <TabsTrigger value='transactions' className='flex-1'>
              Transactions
            </TabsTrigger>
            <TabsTrigger value='refunds' className='flex-1'>
              Refunds
            </TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='overflow-y-auto' style={{ height: '600px' }}>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <Accordion
                type='multiple'
                defaultValue={['order-summary', 'order-items']}
                className='md:col-span-3 w-full'
              >
                <AccordionItem value='order-summary'>
                  <Card className='md:col-span-2'>
                    <CardContent className='p-6'>
                      <AccordionTrigger className='text-2xl font-semibold mb-6'>Order Summary</AccordionTrigger>
                      <AccordionContent>
                        <div className='bg-green-50 p-4 rounded-lg mb-6'>
                          <h3 className='text-xl font-medium text-green-700'>
                            Order Status:{' '}
                            {order.order_status === 'returned'
                              ? 'RETURNED'
                              : order.order_status === 'cancelled'
                              ? 'CANCELLED'
                              : order.refunds && order.refunds.length > 0 && order.order_status !== 'returned'
                              ? 'REFUNDED'
                              : order.order_status === 'not_confirmed'
                              ? 'NOT CONFIRMED'
                              : order.order_status.toUpperCase()}
                          </h3>
                          <p className='text-gray-600 mt-2'>
                            {order.order_status === 'returned'
                              ? 'Order was picked up and return has been processed'
                              : order.order_status === 'cancelled'
                              ? order.delivery_status
                              : order.refunds && order.refunds.length > 0
                              ? 'Refund has been processed for this order'
                              : order.order_status === 'not_confirmed' && order.payment_status
                              ? 'Payment received but order was not confirmed. Refund will be processed automatically.'
                              : order.delivery_status}
                          </p>
                        </div>
                        <div className='space-y-5'>
                          <div className='flex justify-between items-center border-b pb-4'>
                            <span className='text-gray-600 font-medium'>Order Date:</span>
                            <span className='font-medium text-right'>
                              {new Date(order.payment_at).toLocaleString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className='flex justify-between items-center border-b pb-4'>
                            <span className='text-gray-600 font-medium'>Order Status:</span>
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.order_status === 'returned'
                                  ? 'bg-orange-100 text-orange-800'
                                  : order.order_status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : order.refunds && order.refunds.length > 0 && order.order_status !== 'returned'
                                  ? 'bg-red-100 text-red-800'
                                  : order.order_status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.order_status === 'confirmed' || order.order_status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.order_status === 'processing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.order_status === 'not_confirmed'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.order_status === 'returned'
                                ? 'RETURNED'
                                : order.order_status === 'cancelled'
                                ? 'CANCELLED'
                                : order.refunds && order.refunds.length > 0 && order.order_status !== 'returned'
                                ? 'REFUNDED'
                                : order.order_status === 'not_confirmed'
                                ? 'NOT CONFIRMED'
                                : order.order_status.toUpperCase()}
                            </div>
                          </div>
                          <div className='flex justify-between items-center border-b pb-4'>
                            <span className='text-gray-600 font-medium'>Payment Method:</span>
                            <span className='font-medium capitalize text-right'>{order.payment_method}</span>
                          </div>
                          <div className='flex justify-between items-center pt-2'>
                            <span className='text-gray-600 font-medium'>Total Amount:</span>
                            <span className='font-bold text-lg'>₹{order.total_amount}</span>
                          </div>
                        </div>
                        <div className='border rounded-md p-4 bg-gray-50 mt-6'>
                          <h3 className='text-sm font-semibold mb-3'>Order Summary</h3>
                          <div className='space-y-2'>
                            <div className='flex justify-between items-center text-xs'>
                              <span className='text-gray-600'>Original Price:</span>
                              <span>₹{order.original_price}</span>
                            </div>
                            {order.discount_details.discount_amount > 0 && (
                              <div className='flex justify-between items-center text-xs text-green-600'>
                                <span>Discount ({order.discount_details.coupon_code}):</span>
                                <span>-₹{order.discount_details.discount_amount}</span>
                              </div>
                            )}
                            <div className='flex justify-between items-center font-bold text-sm mt-2 pt-2 border-t'>
                              <span>Total Amount:</span>
                              <span>₹{order.total_amount}</span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </CardContent>
                  </Card>
                </AccordionItem>
                <AccordionItem value='order-items'>
                  <Card>
                    <CardContent className='p-6'>
                      <AccordionTrigger className='text-xl font-semibold mb-4'>Order Items</AccordionTrigger>
                      <AccordionContent>
                        <div className='space-y-6'>
                          {order.items.map((item, index) => (
                            <div key={index} className='border rounded-md p-3 bg-gray-50'>
                              <div className='flex gap-3 items-start'>
                                <div className='h-16 w-16 bg-white rounded-md flex items-center justify-center flex-shrink-0'>
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className='h-14 w-14 object-contain' />
                                  ) : (
                                    <Package className='h-6 w-6 text-gray-500' />
                                  )}
                                </div>
                                <div className='flex-1 min-w-0 overflow-hidden'>
                                  <p className='text-sm font-medium line-clamp-2'>{item.name}</p>
                                  <p className='text-xs text-gray-500 mt-1'>Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className='flex justify-between items-center border-t mt-3 pt-2'>
                                <div className='text-xs text-gray-600'>
                                  Unit Price: ₹{parseFloat(item.price).toFixed(2)}
                                </div>
                                <div className='text-sm font-bold'>₹{(item.quantity * item.price).toFixed(2)}</div>
                              </div>
                            </div>
                          ))}
                          <div className='border-t pt-4 mt-6'>
                            <h3 className='font-medium text-base mb-3'>Shipping Information</h3>
                            <div className='border rounded-md p-4 bg-gray-50'>
                              <p className='text-sm font-medium'>{order.customer.name}</p>
                              <p className='text-sm mt-1'>{order.customer.address.line1}</p>
                              <p className='text-sm'>
                                {order.customer.address.city}, {order.customer.address.state}{' '}
                                {order.customer.address.pincode}
                              </p>
                              <p className='text-sm mt-1'>{order.customer.phone}</p>
                            </div>
                          </div>
                          <div className='border-t pt-4 mt-6'>
                            <h3 className='font-medium text-base mb-3'>Delivery Status</h3>
                            <div className='border rounded-md p-4 bg-gray-50'>
                              <div className='flex items-center gap-2'>
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    order.order_status === 'returned'
                                      ? 'bg-orange-500'
                                      : order.order_status === 'cancelled'
                                      ? 'bg-red-500'
                                      : order.refunds && order.refunds.length > 0 && order.order_status !== 'returned'
                                      ? 'bg-red-500'
                                      : order.order_status === 'shipped'
                                      ? 'bg-blue-500'
                                      : order.order_status === 'confirmed' || order.order_status === 'delivered'
                                      ? 'bg-green-500'
                                      : order.order_status === 'not_confirmed'
                                      ? 'bg-yellow-500'
                                      : 'bg-yellow-500'
                                  }`}
                                ></div>
                                <p className='text-sm font-medium'>
                                  {order.order_status === 'returned'
                                    ? 'Order was picked up and return has been processed'
                                    : order.order_status === 'cancelled'
                                    ? order.delivery_status
                                    : order.refunds && order.refunds.length > 0
                                    ? 'Refund has been processed for this order'
                                    : order.order_status === 'not_confirmed' && order.payment_status
                                    ? 'Payment received but order was not confirmed. Refund will be processed automatically.'
                                    : order.delivery_status}
                                </p>
                              </div>
                              {order.shipping.estimated_delivery &&
                                !(order.refunds && order.refunds.length > 0) &&
                                order.order_status !== 'returned' &&
                                order.order_status !== 'cancelled' && (
                                  <p className='text-sm text-gray-500 mt-2'>
                                    Estimated Delivery:{' '}
                                    {new Date(order.shipping.estimated_delivery).toLocaleDateString()}
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </CardContent>
                  </Card>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value='transactions' className='overflow-y-auto' style={{ height: '600px' }}>
            <Card>
              <CardContent className='p-4'>
                <h2 className='text-xl font-semibold mb-4'>All Transactions</h2>

                <div className='space-y-4'>
                  {order.transactions.length > 0 ? (
                    order.transactions.map((transaction, index) => (
                      <div key={index} className='border rounded-lg p-3'>
                        <div className='flex items-center justify-between flex-wrap gap-2'>
                          <div>
                            <h3 className='font-bold text-base'>{transaction.payment_provider.toUpperCase()}</h3>
                            <p className='text-xs text-gray-500'>{new Date(transaction.created_at).toLocaleString()}</p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.status.toUpperCase()}
                          </div>
                        </div>

                        <div className='mt-3 space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Payment ID:</span>
                            <div className='flex items-center'>
                              <span className='font-medium'>{transaction.payment_id}</span>
                              <button
                                onClick={() => copyToClipboard(transaction.payment_id)}
                                className='ml-2 text-blue-600 hover:text-blue-800'
                              >
                                <ClipboardCheck size={16} />
                              </button>
                            </div>
                          </div>

                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Amount:</span>
                            <span className='font-medium'>₹{transaction.amount}</span>
                          </div>

                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Method:</span>
                            <span className='font-medium capitalize'>{transaction.payment_method}</span>
                          </div>

                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Bank Status:</span>
                            <span className='font-medium'>{transaction.bank_status}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center p-8 bg-gray-100 rounded-lg'>
                      <p>No transaction records found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='refunds' className='overflow-y-auto' style={{ height: '600px' }}>
            <Card>
              <CardContent className='p-4'>
                <h2 className='text-xl font-semibold mb-4'>All Refunds</h2>

                <div className='space-y-4'>
                  {order.refunds.length > 0 ? (
                    order.refunds.map((refund, index) => (
                      <div key={index} className='border rounded-lg p-3'>
                        <div className='flex items-center justify-between flex-wrap gap-2'>
                          <div>
                            <h3 className='font-bold text-base'>Refund {index + 1}</h3>
                            <p className='text-xs text-gray-500'>
                              {refund.refunded_at
                                ? new Date(refund.refunded_at).toLocaleString()
                                : new Date(refund.created_at).toLocaleString() + ' (Initiated)'}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              refund.status === 'Success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {refund.status.toUpperCase()}
                          </div>
                        </div>

                        <div className='mt-3 space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Refund ID:</span>
                            <span className='font-medium'>{refund.refund_id}</span>
                          </div>

                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Amount:</span>
                            <span className='font-medium'>₹{refund.amount}</span>
                          </div>

                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Type:</span>
                            <span className='font-medium'>{refund.refund_type}</span>
                          </div>

                          {refund.arn_number && (
                            <div className='flex justify-between text-sm'>
                              <span className='text-gray-600'>ARN Number:</span>
                              <span className='font-medium'>{refund.arn_number}</span>
                            </div>
                          )}

                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Status Description:</span>
                            <span className='font-medium'>{refund.status_description}</span>
                          </div>

                          <div className='mt-2 text-sm text-blue-600 border-t pt-2'>
                            {refund.status === 'Success'
                              ? 'Your refund has been processed and will be credited to your account within 2-3 business days. Please check your bank statement before raising a support ticket.'
                              : 'Your refund has been initiated and will be credited to your account within 3-5 business days. Please check your bank statement before raising a support ticket.'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center p-8 bg-gray-100 rounded-lg'>
                      <p>No refunds found for this order.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className='flex justify-center mt-6'>
          <Button onClick={() => setIsDialogOpen(true)} className='bg-blue-900 hover:bg-blue-800'>
            Contact Support
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Reason</label>
              <Select
                value={reason}
                onValueChange={(value) => {
                  setReason(value);
                  setIssueType('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a reason' />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {reason && (
              <div>
                <label className='text-sm font-medium'>Issue Type</label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select issue type' />
                  </SelectTrigger>
                  <SelectContent>
                    {issueOptions[reason as keyof typeof issueOptions]?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className='text-sm font-medium'>Description</label>
              <Textarea
                placeholder='Please describe your issue'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='mt-1'
              />
            </div>

            <Button type='submit' className='w-full bg-blue-900 hover:bg-blue-800'>
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default TransactionDetails;
