import { Customer } from '@/types';

export const mockCustomers: Map<string, Customer> = new Map([
  [
    '9871454433',
    {
      id: 'C001',
      phone: '9871454433',
      name: 'Chirag Taneja',
      email: 'c@gokwik.co',
      orders: [
        {
          orderId: 'ORD001',
          product: 'Premium Package',
          amount: 999,
          address: '123 Main St, City',
          date: '2024-04-23',
          transaction: {
            transactionId: 'TRX001',
            amount: 999,
            status: 'success',
            date: '2024-04-23',
            paymentMethod: 'Credit Card',
          },
        },
        {
          orderId: 'ORD002',
          product: 'Basic Package',
          amount: 499,
          address: '123 Main St, City',
          date: '2024-04-20',
          transaction: {
            transactionId: 'TRX002',
            amount: 499,
            status: 'failed',
            date: '2024-04-20',
            paymentMethod: 'UPI',
          },
        },
      ],
    },
  ],
  [
    '9876543210',
    {
      id: 'C002',
      phone: '9876543210',
      name: 'Jane Smith',
      email: 'jane@example.com',
      orders: [
        {
          orderId: 'ORD003',
          product: 'Standard Package',
          amount: 799,
          address: '456 Oak St, Town',
          date: '2024-04-22',
          transaction: {
            transactionId: 'TRX003',
            amount: 799,
            status: 'pending',
            date: '2024-04-22',
            paymentMethod: 'Net Banking',
          },
        },
      ],
    },
  ],
]);
