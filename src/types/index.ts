
export interface Customer {
  id: string;
  phone: string;
  name: string;
  email: string;
  orders: Order[];
}

export interface Order {
  orderId: string;
  product: string;
  amount: number;
  address: string;
  date: string;
  transaction: Transaction;
}

export interface Transaction {
  transactionId: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
  paymentMethod: string;
}

export interface SupportTicket {
  reason: string;
  issueType: string;
  description: string;
  orderId?: string;
}

// Extended types for the new implementation
export * from "../data/mockOrders";

// Chat types
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
