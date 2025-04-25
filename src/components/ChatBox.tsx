import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send } from 'lucide-react';
import { ChatMessage, Order, Refund } from '@/types';

interface ChatBoxProps {
  onClose: () => void;
}

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
      return `✅ Refund Status for Order #${orderNumber}:\n💰 Refund Amount: ₹${
        refundInfo.amount
      }\n🔁 Refund Date: ${new Date(refundInfo.refunded_at).toLocaleDateString()}\n📌 ARN Number: ${
        refundInfo.arn_number || 'Processing'
      }\n\nRefund has been processed successfully and will be credited to your account within 2-3 business days. Please check your bank statement before raising a support ticket.`;
    } else if (refundInfo.status === 'Initiated') {
      return `🔄 Your refund for Order #${orderNumber} is being processed.\nYou'll receive the amount in your bank within 3-5 working days. Please check your bank statement before raising a support ticket.`;
    } else {
      return `According to our records, the refund for Order #${orderNumber} has not yet been initiated by the merchant.\nPlease reach out to the merchant for further assistance.`;
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

      return `Your order #${order.shopify_order_name} was RETURNED.\nOrder was picked up and return has been processed.\n${refundStatus}\n\nOrder Details:\n- Total Amount: ₹${order.total_amount}\n- Payment Method: ${order.payment_method}`;
    } else if (order.order_status === 'confirmed') {
      return `✅ Your order #${order.shopify_order_name} is CONFIRMED.\n${order.delivery_status}\n\nOrder Details:\n- Total Amount: ₹${order.total_amount}\n- Payment Method: ${order.payment_method}\n- Payment Status: Successful`;
    } else {
      return `Your order #${order.shopify_order_name} is currently NOT CONFIRMED.\n${order.delivery_status}`;
    }
  },
  adonc: (order?: Order) => {
    if (!order) {
      return "I couldn't find that order in our system. Could you please verify the order number and try again?";
    }

    if (order.order_status === 'confirmed') {
      return `Your order #${order.shopify_order_name} is confirmed. The payment has been successfully processed and your order will be shipped soon.`;
    } else {
      return `Your order #${order.shopify_order_name} is not confirmed yet. Please wait while we verify the payment. If there's any issue, a refund will be processed automatically.`;
    }
  },
  default:
    "I'm not sure how to help with that. Could you please be more specific? You can ask about:\n- Refund Status\n- Order Status\n- Amount Debited but Order not Confirmed",
};

export function ChatBox({ onClose }: ChatBoxProps) {
  const { detailedOrders } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: botResponses.greeting,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForOrderNumber, setWaitingForOrderNumber] = useState(false);
  const [waitingForARN, setWaitingForARN] = useState(false);
  const [currentContext, setCurrentContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const findOrderByNumber = (orderNumber: string) => {
    const normalizedInput = orderNumber.toLowerCase().replace('#', '').trim();
    return detailedOrders.find(
      (order) =>
        order.order_number.toLowerCase() === normalizedInput ||
        order.shopify_order_name.toLowerCase().replace('#', '') === normalizedInput
    );
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
      return botResponses.adonc(order);
    }

    return botResponses.orderStatus(order);
  };

  const processUserMessage = (text: string) => {
    if (waitingForOrderNumber) {
      return handleOrderNumberInput(text);
    }

    if (waitingForARN) {
      setWaitingForARN(false);
      return `I found information for ARN ${text}. The refund has been successfully processed and should reflect in your account within 2-3 business days.`;
    }

    const normalizedText = text.toLowerCase().trim();

    if (normalizedText.includes('thank') || normalizedText === 'ty') {
      return "You're welcome! Let me know if you need anything else.";
    }

    if (normalizedText.includes('bye') || normalizedText === 'exit') {
      return 'Thank you for chatting with us. Have a great day!';
    }

    if (
      normalizedText.includes('refund status') ||
      normalizedText.includes('where is my refund') ||
      normalizedText.includes('check refund')
    ) {
      setCurrentContext('refund');
      setWaitingForOrderNumber(true);
      return botResponses.askOrderNumber;
    }

    if (
      normalizedText.includes('order status') ||
      normalizedText.includes('my order') ||
      normalizedText.includes('track')
    ) {
      setCurrentContext('order');
      setWaitingForOrderNumber(true);
      return botResponses.askOrderNumber;
    }

    if (
      normalizedText.includes('amount debited') ||
      normalizedText.includes('payment deducted') ||
      normalizedText.includes('paid but no order')
    ) {
      setCurrentContext('adonc');
      setWaitingForOrderNumber(true);
      return botResponses.askOrderNumber;
    }

    if (normalizedText.includes('cancel') || normalizedText.includes('cancellation')) {
      return 'To cancel your order, please contact the merchant brand directly. We do not handle cancellations.';
    }

    if (normalizedText.includes('hi') || normalizedText.includes('hello') || normalizedText.includes('hey')) {
      return botResponses.greeting;
    }

    if (normalizedText.includes('arn') || normalizedText.includes('reference')) {
      setWaitingForARN(true);
      return botResponses.askRefundARN;
    }

    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

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
    <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
      <div className='p-4 bg-blue-900 text-white flex justify-between items-center'>
        <div>
          <h2 className='font-medium'>GoKwik Support</h2>
          <p className='text-xs text-blue-200'>Online • Usually replies instantly</p>
        </div>
        <Button variant='ghost' size='sm' className='text-white hover:bg-blue-800' onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <div className='p-4 overflow-y-auto space-y-4' style={{ height: '350px' }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-lg p-3 ${
                message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className='whitespace-pre-wrap text-sm'>{message.text}</p>
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
          <Button type='submit' disabled={!inputMessage.trim() || isTyping} className='bg-blue-900 hover:bg-blue-800'>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
