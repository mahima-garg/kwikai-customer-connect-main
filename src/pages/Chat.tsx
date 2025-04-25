import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send } from 'lucide-react';
import { ChatMessage } from '@/types';
import { AppLayout } from '@/components/AppLayout';
import { Order, Refund } from '@/data/mockOrders';

const botResponses = {
  greeting:
    "Hello! 👋 Welcome to Gokwik support. I can help you with:\n- Refund Status\n- Order Status\n- Amount Debited but Order not Confirmed\n\nPlease type your query below or enter the specific command (e.g. 'refund status', 'order status').",
  askOrderNumber: 'Could you please provide your order number so I can check the status for you?',
  askRefundARN: 'Do you have the refund ARN number? If yes, please share it so I can provide more specific details.',
  noOrderFound: "I couldn't find an order with that number. Please check and try again with a valid order number.",
  refundStatus: (refundInfo?: Refund, orderNumber?: string) => {
    if (!refundInfo) {
      return "I couldn't find any refund information for your order. If you've initiated a refund recently, please check back in 24-48 hours.";
    }

    if (refundInfo.status === 'Success') {
      return `✅ Refund Status for Order #${orderNumber}: Success\n💰 Refund Amount: ₹${
        refundInfo.amount
      }\n🔁 Refund Date: ${new Date(refundInfo.refunded_at).toLocaleDateString()}\n📌 ARN Number: ${
        refundInfo.arn_number || 'Processing'
      }\n\nNote: Refunds are usually credited within 5–8 working days (excluding Saturdays & Sundays). Please check your bank statement before raising a support ticket.`;
    } else if (refundInfo.status === 'Initiated') {
      return `🔄 Your refund for Order #${orderNumber} is currently being processed.\nYou'll receive the amount in your bank within 3–5 working days. Please check your bank statement before raising a support ticket.`;
    } else {
      return `According to our records, the refund for Order #${orderNumber} has not yet been initiated by the merchant.\nPlease reach out to the merchant for further assistance.`;
    }
  },
  refundNotReceived: (refundInfo?: Refund, orderNumber?: string) => {
    if (!refundInfo) {
      return "I don't see any recent refunds in your account. If you believe this is an error, please write to support@gokwik.co with your order details.";
    }

    if (refundInfo.status === 'Success') {
      return `✅ Refund Status for Order #${orderNumber}: Success\n📌 ARN Number: ${
        refundInfo.arn_number || 'Processing'
      }\n\nNote: It typically takes 3–5 working days for the bank to credit the amount. Please check your bank statement before contacting support.\n\nHas it been more than 7 days since this status update? If yes, please write to 📧 support@gokwik.co with your bank statement (from date of transaction till today), and we'll help you further.`;
    } else {
      return `Your refund for Order #${orderNumber} is in process. You'll receive the amount within 3–5 working days. Thanks for your patience! Please check your bank statement before raising a support ticket.`;
    }
  },
  orderStatus: (order?: Order) => {
    if (!order) {
      return "I couldn't find that order in our system. Could you please verify the order number and try again?";
    }

    // Check if the order has refunds but is still marked as confirmed - it should be displayed as returned
    const hasRefunds = order.refunds && order.refunds.length > 0;
    const shouldBeReturned = hasRefunds && order.order_status === 'confirmed';

    if (shouldBeReturned || order.order_status === 'returned') {
      const refundInfo = hasRefunds ? order.refunds[0] : null;
      const refundStatus = refundInfo
        ? refundInfo.status === 'Success'
          ? 'Your refund has been processed and will be credited within 2-3 business days. Please check your bank statement before raising a support ticket.'
          : 'Your refund is being initiated and will be credited within 3-5 business days. Please check your bank statement before raising a support ticket.'
        : 'Your refund will be processed shortly.';

      return `Your order #${
        order.shopify_order_name
      } was RETURNED.\nOrder was picked up and return has been processed.\n${refundStatus}\n\nOrder Details:\n- Total Amount: ₹${
        order.total_amount
      }\n- Payment Method: ${order.payment_method}\n- Payment Status: ${
        order.payment_status ? 'Successful' : 'Failed'
      }`;
    } else if (
      order.order_status === 'confirmed' ||
      order.order_status === 'shipped' ||
      order.order_status === 'delivered'
    ) {
      return `✅ Your order #${order.shopify_order_name} is ${order.order_status.toUpperCase()} and being processed.\n${
        order.delivery_status
      }\n\nOrder Details:\n- Total Amount: ₹${order.total_amount}\n- Payment Method: ${
        order.payment_method
      }\n- Payment Status: ${order.payment_status ? 'Successful' : 'Failed'}\n`;
    } else if (order.order_status === 'not_confirmed' && order.payment_status) {
      return `⚠️ Your order #${order.shopify_order_name} was NOT CONFIRMED, but your payment was successful.\nA refund will be processed automatically and you should receive it within 5–8 working days.\nIf you do not receive your refund, please contact support.`;
    } else if (order.order_status === 'cancelled' && order.payment_status) {
      const hasRefund = order.refunds && order.refunds.length > 0;
      return `Your order #${order.shopify_order_name} was CANCELLED, but your payment was successful.\n${
        hasRefund
          ? "A refund has already been initiated. You'll get the amount within 5–8 working days. Please check your bank statement before raising a support ticket."
          : 'A refund will be processed shortly.'
      }`;
    } else if (order.order_status === 'cancelled') {
      return `Your order #${order.shopify_order_name} was CANCELLED and payment was not debited.\nPlease check your bank account. No deduction has been made.\n\nIs there anything else I can help you with?`;
    } else {
      return `Your order #${order.shopify_order_name} is currently in ${order.order_status.toUpperCase()} status.\n${
        order.delivery_status
      }\n\nDo you need any other information about this order?`;
    }
  },
  adonc: (orderNumber?: string) =>
    `Looks like your order #${
      orderNumber || ''
    } didn't go through, but your payment was successful. A refund will be processed automatically and you should receive it within 5–8 working days.\n\nWould you like me to track the refund status for you?`,
  cancelOrder:
    'To cancel your order, please contact the merchant brand directly.\nWe do not handle cancellations from our end.\n\nIs there something else I can help you with?',
  default:
    "I'm not sure how to help with that. Could you please be more specific? You can ask about refund status, order status, or payment issues.",
  wrongCommand: "I don't understand that command. Please ask me about refund status, order status, or payment issues.",
  thankYou: "You're welcome! Is there anything else I can help you with today?",
  goodbye: 'Thank you for chatting with us. Have a great day! Feel free to come back anytime you need assistance.',
  followUp: "Is there anything else you'd like to know about your order or refund?",
};

const Chat = () => {
  const { detailedOrders, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForOrderNumber, setWaitingForOrderNumber] = useState(false);
  const [waitingForARN, setWaitingForARN] = useState(false);
  const [currentContext, setCurrentContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Add initial greeting message
    setMessages([
      {
        id: '1',
        text: botResponses.greeting,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findOrderByNumber = (orderNumber: string) => {
    // First check in user's orders
    for (const order of detailedOrders) {
      if (
        order.order_number.toLowerCase() === orderNumber.toLowerCase() ||
        order.shopify_order_name.toLowerCase() === orderNumber.toLowerCase() ||
        order.shopify_order_name.toLowerCase().replace('#', '') === orderNumber.toLowerCase()
      ) {
        return order;
      }
    }

    // Then check in all orders (for demo purposes)
    const allOrders = Array.from(new Set(detailedOrders));
    for (const order of allOrders) {
      if (
        order.order_number.toLowerCase() === orderNumber.toLowerCase() ||
        order.shopify_order_name.toLowerCase() === orderNumber.toLowerCase() ||
        order.shopify_order_name.toLowerCase().replace('#', '') === orderNumber.toLowerCase()
      ) {
        return order;
      }
    }

    return null;
  };

  const findRefundByARN = (arn: string) => {
    // Check all orders for refunds with matching ARN
    for (const order of detailedOrders) {
      if (order.refunds && order.refunds.length > 0) {
        for (const refund of order.refunds) {
          if (refund.arn_number && refund.arn_number.toLowerCase() === arn.toLowerCase()) {
            return { refund, order };
          }
        }
      }
    }
    return null;
  };

  const handleOrderNumberInput = (text: string) => {
    setWaitingForOrderNumber(false);

    const order = findOrderByNumber(text);
    if (!order) {
      return botResponses.noOrderFound;
    }

    if (currentContext === 'refund') {
      const latestRefund = order.refunds.length > 0 ? order.refunds[0] : null;
      return botResponses.refundStatus(latestRefund, order.shopify_order_name);
    } else if (currentContext === 'order') {
      return botResponses.orderStatus(order);
    } else if (currentContext === 'adonc') {
      return botResponses.adonc(order.shopify_order_name);
    }

    return botResponses.orderStatus(order);
  };

  const handleARNInput = (text: string) => {
    setWaitingForARN(false);

    const result = findRefundByARN(text);
    if (!result) {
      return "I couldn't find a refund with that ARN number. Please check and try again.";
    }

    return `✅ Refund Status for ARN ${text}:\nOrder: ${result.order.shopify_order_name}\nAmount: ₹${
      result.refund.amount
    }\nStatus: ${result.refund.status}\nRefund Date: ${new Date(
      result.refund.refunded_at || result.refund.created_at
    ).toLocaleDateString()}\n\nIs there anything else you'd like to know about this refund?`;
  };

  const processUserMessage = (text: string) => {
    // If waiting for specific inputs, process accordingly
    if (waitingForOrderNumber) {
      return handleOrderNumberInput(text);
    }

    if (waitingForARN) {
      return handleARNInput(text);
    }

    // Process regular commands
    text = text.toLowerCase();

    // Check for thank you messages
    if (text.includes('thank') || text.includes('thanks') || text === 'ty') {
      return botResponses.thankYou;
    }

    // Check for goodbye messages
    if (text.includes('bye') || text.includes('goodbye') || text === 'exit' || text === 'quit') {
      return botResponses.goodbye;
    }

    // Find the most recent order
    const latestOrder = detailedOrders.length > 0 ? detailedOrders[0] : null;

    // Find the most recent refund
    const latestRefund = latestOrder?.refunds.length > 0 ? latestOrder.refunds[0] : null;

    if (text.includes('refund status') || text.includes('where is my refund') || text.includes('check refund')) {
      setCurrentContext('refund');
      setWaitingForOrderNumber(true);
      return botResponses.askOrderNumber;
    } else if (text.includes("haven't received") || text.includes('not credited') || text.includes('no refund')) {
      setCurrentContext('refund');
      setWaitingForOrderNumber(true);
      return botResponses.askOrderNumber;
    } else if (text.includes('order status') || text.includes('my order') || text.includes('where is my order')) {
      setCurrentContext('order');
      setWaitingForOrderNumber(true);
      return botResponses.askOrderNumber;
    } else if (
      text.includes('amount debited') ||
      text.includes('payment deducted') ||
      text.includes('paid but no order')
    ) {
      setCurrentContext('adonc');
      setWaitingForOrderNumber(true);
      return botResponses.askOrderNumber;
    } else if (text.includes('cancel') || text.includes('cancellation')) {
      return botResponses.cancelOrder;
    } else if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      return botResponses.greeting;
    } else if (text.includes('arn') || text.includes('reference number')) {
      setWaitingForARN(true);
      return botResponses.askRefundARN;
    } else {
      return botResponses.default;
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot thinking and typing
    setTimeout(() => {
      const botResponse = processUserMessage(inputMessage);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <AppLayout>
      <div>
        <h1 className='text-2xl font-bold mb-6'>Chat with us</h1>

        <div className='bg-white rounded-lg shadow overflow-hidden flex flex-col'>
          <div className='p-4 bg-blue-900 text-white'>
            <h2 className='font-medium'>GoKwik Support</h2>
            <p className='text-xs text-blue-200'>Online • Usually replies instantly</p>
          </div>

          {/* Messages container */}
          <div className='p-4 overflow-y-auto space-y-4' style={{ height: '400px' }}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className='whitespace-pre-wrap'>{message.text}</p>
                  <p className='text-xs mt-1 opacity-70'>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className='flex justify-start'>
                <div className='bg-gray-100 rounded-lg p-3'>
                  <div className='flex space-x-1'>
                    <div className='h-2 w-2 bg-gray-500 rounded-full animate-bounce'></div>
                    <div className='h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-100'></div>
                    <div className='h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-200'></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className='p-4 border-t bg-white'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className='flex gap-2'
            >
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  waitingForOrderNumber
                    ? 'Enter your order number...'
                    : waitingForARN
                    ? 'Enter your ARN number...'
                    : 'Type your message...'
                }
                className='flex-1'
                disabled={isTyping}
              />
              <Button
                type='submit'
                disabled={!inputMessage.trim() || isTyping}
                className='bg-blue-900 hover:bg-blue-800'
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;
