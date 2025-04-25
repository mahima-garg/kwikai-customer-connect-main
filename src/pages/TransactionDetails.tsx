import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ClipboardCheck, Package } from "lucide-react";

const reasonOptions = [
  "Refund Status",
  "Refund Not Credited",
  "Order Status",
  "Amount Debited Order Not Confirmed",
];

const issueOptions = {
  "Refund Status": [
    "Need ARN number",
    "Refund timeline query",
    "Refund status check",
    "Others",
  ],
  "Refund Not Credited": [
    "Bank statement verification",
    "Payment gateway issue",
    "Delayed refund",
    "Others",
  ],
  "Order Status": [
    "Where is my order",
    "Order delayed",
    "Wrong order delivered",
    "Others",
  ],
  "Amount Debited Order Not Confirmed": [
    "Transaction failed after payment",
    "Double payment",
    "Payment stuck",
    "Others",
  ],
};

const TransactionDetails = () => {
  const { orderId } = useParams();
  const { detailedOrders, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [issueType, setIssueType] = useState<string>("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const order = detailedOrders.find((o) => o.order_number === orderId);
  
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const successTransaction = order.transactions.find(t => t.status === 'success') || order.transactions[0];
  
  const latestRefund = order.refunds.length > 0 ? order.refunds[0] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      orderId,
      reason,
      issueType,
      description,
    });
    toast({
      title: "Support ticket created",
      description: "We'll get back to you soon",
    });
    setIsDialogOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The payment ID has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Payment Details</h1>
        <p className="text-gray-500 mb-8">
          Order {order.shopify_order_name} • {order.order_number}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Transaction Information</h2>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-medium text-green-700">
                  Payment was successfully settled to the Merchant
                </h3>
                <p className="text-gray-600 mt-1">
                  Your payment of ₹{order.total_amount} made towards {order.customer.name.split(' ')[0].toUpperCase()} has been successful. 
                  We request you to contact {order.customer.name.split(' ')[0].toUpperCase()} for any update on the service or to initiate a refund in case the service/goods were not delivered.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-yellow-200 to-blue-400 rounded-md flex items-center justify-center">
                    {order.items[0]?.image ? (
                      <img 
                        src={order.items[0].image} 
                        alt={order.items[0].name} 
                        className="h-12 w-12 object-contain"
                      />
                    ) : (
                      <div className="text-3xl font-bold text-blue-900">
                        {order.customer?.name?.charAt(0) || 'M'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{order.customer.name.split(' ')[0].toUpperCase()}</h3>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      successTransaction?.status === "success" ? "bg-green-100 text-green-800" : 
                      successTransaction?.status === "initiated" ? "bg-yellow-100 text-yellow-800" : 
                      "bg-red-100 text-red-800"
                    }`}>
                      {successTransaction?.status === "success" ? "SUCCESS" : 
                       successTransaction?.status === "initiated" ? "PENDING" : 
                       "FAILED"}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-gray-600">Payment ID:</span>
                    <div className="flex items-center">
                      <span className="font-medium">{successTransaction?.payment_id}</span>
                      <button 
                        onClick={() => copyToClipboard(successTransaction?.payment_id)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <ClipboardCheck size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-gray-600">Date and Time:</span>
                    <span className="font-medium">
                      {new Date(successTransaction?.created_at).toLocaleString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-gray-600">Payment Amount:</span>
                    <span className="font-medium">₹{successTransaction?.amount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{successTransaction?.payment_method}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Gateway:</span>
                    <span className="font-medium capitalize">{successTransaction?.payment_provider}</span>
                  </div>
                </div>
              </div>
              
              {latestRefund && (
                <div className="mt-6 bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Refund Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="text-gray-600">Refund Status:</span>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        latestRefund.status === "Success" ? "bg-green-100 text-green-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {latestRefund.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="text-gray-600">Refund ID:</span>
                      <span className="font-medium">{latestRefund.refund_id}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="text-gray-600">Refund Amount:</span>
                      <span className="font-medium">₹{latestRefund.amount}</span>
                    </div>
                    
                    {latestRefund.arn_number && (
                      <div className="flex justify-between items-center border-b pb-3">
                        <span className="text-gray-600">ARN Number:</span>
                        <span className="font-medium">{latestRefund.arn_number}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="text-gray-600">Refund Type:</span>
                      <span className="font-medium">{latestRefund.refund_type}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Refund Date:</span>
                      <span className="font-medium">
                        {new Date(latestRefund.refunded_at || latestRefund.created_at).toLocaleString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="w-full md:w-auto bg-blue-900 hover:bg-blue-800"
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-14 w-14 object-contain"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span>Original Price:</span>
                    <span>₹{order.original_price}</span>
                  </div>
                  {order.discount_details.discount_amount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <span>Discount ({order.discount_details.coupon_code}):</span>
                      <span>-₹{order.discount_details.discount_amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-bold mt-2">
                    <span>Total Amount:</span>
                    <span>₹{order.total_amount}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Shipping Information</h3>
                  <p className="text-sm">{order.customer.name}</p>
                  <p className="text-sm">{order.customer.address.line1}</p>
                  <p className="text-sm">
                    {order.customer.address.city}, {order.customer.address.state} {order.customer.address.pincode}
                  </p>
                  <p className="text-sm">{order.customer.phone}</p>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Delivery Status</h3>
                  <p className="text-sm">{order.delivery_status}</p>
                  {order.shipping.estimated_delivery && (
                    <p className="text-xs text-gray-500 mt-1">
                      Estimated Delivery: {new Date(order.shipping.estimated_delivery).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason</label>
              <Select
                value={reason}
                onValueChange={(value) => {
                  setReason(value);
                  setIssueType("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
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
                <label className="text-sm font-medium">Issue Type</label>
                <Select
                  value={issueType}
                  onValueChange={setIssueType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
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
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Please describe your issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionDetails;
