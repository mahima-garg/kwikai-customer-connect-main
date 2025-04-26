export interface OrderItem {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface DiscountDetails {
  coupon_code: string;
  discount_amount: number;
  prepaid_discount: string;
  final_price: number;
}

export interface Transaction {
  amount: number;
  payment_id: string;
  payment_method: string;
  payment_provider: string;
  status: string;
  bank_status: string;
  created_at: string;
  updated_at: string;
}

export interface Refund {
  refund_id: string;
  amount: number;
  refund_type: string;
  status: string;
  status_description: string;
  created_at: string;
  refunded_at: string;
  payment_provider: string;
  arn_number?: string;
}

export interface OrderSource {
  source: string;
  referrer: string;
  landing_page: string;
}

export interface Order {
  order_number: string;
  shopify_order_name: string;
  order_status: string;
  payment_status: boolean;
  payment_method: string;
  payment_provider: string;
  payment_at: string;
  total_amount: number;
  original_price: number;
  discount_details: DiscountDetails;
  currency: string;
  fulfilled: string;
  customer: CustomerInfo;
  items: OrderItem[];
  shipping: {
    method: string;
    estimated_delivery: string;
  };
  transactions: Transaction[];
  refunds: Refund[];
  order_source: OrderSource;
  delivery_status: string;
  merchant_name: string;
  refund_status?: string;
}

export const mockOrders: Order[] = [
  {
    order_number: 'KWIK01IU00QA1586996',
    shopify_order_name: '#7925270',
    order_status: 'confirmed',
    payment_status: true,
    payment_method: 'UPIIntent',
    payment_provider: 'easebuzz',
    payment_at: '2025-04-25T06:15:31.014Z',
    total_amount: 784,
    original_price: 1299,
    discount_details: {
      coupon_code: 'grab500',
      discount_amount: 500,
      prepaid_discount: '15%',
      final_price: 784,
    },
    currency: 'INR',
    fulfilled: 'unfulfilled',
    customer: {
      name: 'Biswajit Sarmah',
      email: 'sarmahb06@gmail.com',
      phone: '6001459296',
      address: {
        line1:
          "Mahindra and Mahindra financial services LtdK B road, Domino's Building 3rd floor, Near Dos & Co Pin-785001",
        city: 'JORHAT',
        state: 'ASSAM',
        pincode: '785001',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'Premium Wireless Earphones with 40H Playback',
        sku: '8905650049169',
        quantity: 1,
        price: 1299,
        image: 'https://example.com/images/earphones.png',
      },
    ],
    shipping: {
      method: 'Free Shipping',
      estimated_delivery: '2025-04-29 09:00:00 +0530',
    },
    transactions: [
      {
        amount: 784,
        payment_id: 'KWIK9N9PY4581587159MP',
        payment_method: 'upi',
        payment_provider: 'easebuzz',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-25T06:13:07.160897Z',
        updated_at: '2025-04-25T06:15:15.245024Z',
      },
    ],
    refunds: [],
    order_source: {
      source: 'direct',
      referrer: 'https://www.google.com/',
      landing_page: '/products/premium-audio',
    },
    delivery_status: 'Your order is confirmed and being prepared for shipment',
    merchant_name: 'TechStyle',
    refund_status: null,
  },
  {
    order_number: 'KWIK02TY89QP5432167',
    shopify_order_name: '#7925271',
    order_status: 'returned',
    payment_status: true,
    payment_method: 'Credit Card',
    payment_provider: 'easebuzz',
    payment_at: '2025-04-20T15:23:41.014Z',
    total_amount: 3499,
    original_price: 4999,
    discount_details: {
      coupon_code: 'WELCOME1500',
      discount_amount: 1500,
      prepaid_discount: '10%',
      final_price: 3499,
    },
    currency: 'INR',
    fulfilled: 'returned',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210',
      address: {
        line1: '42, Park Avenue, Near Central Mall',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'Premium Smart Watch with Health Tracking',
        sku: 'SW123456',
        quantity: 1,
        price: 4999,
        image: 'https://example.com/images/smartwatch.png',
      },
    ],
    shipping: {
      method: 'Express Delivery',
      estimated_delivery: '2025-04-22 09:00:00 +0530',
    },
    transactions: [
      {
        amount: 3499,
        payment_id: 'KWIK123456789',
        payment_method: 'credit_card',
        payment_provider: 'easebuzz',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-20T15:23:41.014Z',
        updated_at: '2025-04-20T15:23:41.014Z',
      },
    ],
    refunds: [
      {
        refund_id: 'RKWIK987654321',
        amount: 3499,
        refund_type: 'Full',
        status: 'Success',
        status_description: 'Refund Successful',
        created_at: '2025-04-22T10:00:00.000Z',
        refunded_at: '2025-04-22T10:00:00.000Z',
        payment_provider: 'easebuzz',
        arn_number: 'ARN123456789',
      },
    ],
    order_source: {
      source: 'direct',
      referrer: 'https://www.example.com/',
      landing_page: '/products/smartwatch',
    },
    delivery_status: 'Order was picked up and return has been processed',
    merchant_name: 'WearTech',
    refund_status: 'success',
  },
  {
    order_number: 'KWIK03AB67CD9876543',
    shopify_order_name: '#7925272',
    order_status: 'returned',
    payment_status: true,
    payment_method: 'Net Banking',
    payment_provider: 'easebuzz',
    payment_at: '2025-04-15T09:45:12.014Z',
    total_amount: 1999,
    original_price: 2499,
    discount_details: {
      coupon_code: 'FIRST500',
      discount_amount: 500,
      prepaid_discount: '0%',
      final_price: 1999,
    },
    currency: 'INR',
    fulfilled: 'returned',
    customer: {
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '8765432109',
      address: {
        line1: '78, Green Park, Sector 18',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'Premium Fitness Tracker with Heart Rate Monitor',
        sku: 'FT123456',
        quantity: 1,
        price: 2499,
        image: 'https://example.com/images/fitness-tracker.png',
      },
    ],
    shipping: {
      method: 'Standard Shipping',
      estimated_delivery: '2025-04-18 14:00:00 +0530',
    },
    transactions: [
      {
        amount: 1999,
        payment_id: 'KWIK456789012',
        payment_method: 'netbanking',
        payment_provider: 'easebuzz',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-15T09:45:12.014Z',
        updated_at: '2025-04-15T09:46:22.137267Z',
      },
    ],
    refunds: [
      {
        refund_id: 'RKWIK4TYU1Z3X9876543MP',
        amount: 1999,
        refund_type: 'Full',
        status: 'Success',
        status_description: 'Refund Processed Successfully',
        created_at: '2025-04-16T10:23:45.213574Z',
        refunded_at: '2025-04-18T14:30:26.675Z',
        payment_provider: 'easebuzz',
        arn_number: 'ARN23456789012345',
      },
    ],
    order_source: {
      source: 'direct',
      referrer: 'https://www.example.com/',
      landing_page: '/products/fitness-tracker',
    },
    delivery_status: 'Order was picked up and return has been processed',
    merchant_name: 'FitTech',
    refund_status: 'success',
  },
  {
    order_number: 'KWIK04XY78ZW1234567',
    shopify_order_name: '#7925273',
    order_status: 'processing',
    payment_status: true,
    payment_method: 'UPI',
    payment_provider: 'phonepe',
    payment_at: '2025-04-23T18:34:56.014Z',
    total_amount: 5499,
    original_price: 6999,
    discount_details: {
      coupon_code: 'SUMMER1500',
      discount_amount: 1500,
      prepaid_discount: '0%',
      final_price: 5499,
    },
    currency: 'INR',
    fulfilled: 'unfulfilled',
    customer: {
      name: 'Chirag Taneja',
      email: 'c@gokwik.co',
      phone: '9871454433',
      address: {
        line1: '123, Tech Park, Electronic City',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560100',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'Pink Printed Cotton Straight Suit With Dupatta',
        sku: '8905650067890',
        quantity: 1,
        price: 6999,
        image:
          'https://www.libas.in/cdn/shop/files/36617.Main_aac1d834-f8a8-4666-8517-608ed0ea91e5.jpg?v=1739538630&width=1080',
      },
    ],
    shipping: {
      method: 'Premium Shipping',
      estimated_delivery: '2025-04-26 10:00:00 +0530',
    },
    transactions: [
      {
        amount: 5499,
        payment_id: 'pay_Q9MPj6C3pZ6AsV',
        payment_method: 'upi',
        payment_provider: 'phonepe',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-23T18:34:56.014Z',
        updated_at: '2025-04-23T18:36:12.137267Z',
      },
    ],
    refunds: [],
    order_source: {
      source: 'social',
      referrer: 'https://www.facebook.com/',
      landing_page: '/products/nirvana-ion',
    },
    delivery_status: 'Your order is being processed and will be shipped soon',
    merchant_name: 'Urban Fashion',
  },
  {
    order_number: 'KWIK05PQ34RS9876543',
    shopify_order_name: '#7925274',
    order_status: 'shipped',
    payment_status: true,
    payment_method: 'Wallet',
    payment_provider: 'mobikwik',
    payment_at: '2025-04-22T12:23:45.014Z',
    total_amount: 899,
    original_price: 1499,
    discount_details: {
      coupon_code: 'SAVE600',
      discount_amount: 600,
      prepaid_discount: '5%',
      final_price: 899,
    },
    currency: 'INR',
    fulfilled: 'partially_fulfilled',
    customer: {
      name: 'Sneha Gupta',
      email: 'sneha.gupta@example.com',
      phone: '9012345678',
      address: {
        line1: '56, Lake View Apartments, MG Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'boAt BassHeads 100 in-Ear Wired Headphones with Mic (Black)',
        sku: '8905650023456',
        quantity: 2,
        price: 749,
        image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/bassheads-100.png',
      },
    ],
    shipping: {
      method: 'Standard Shipping',
      estimated_delivery: '2025-04-25 16:00:00 +0530',
    },
    transactions: [
      {
        amount: 899,
        payment_id: 'pay_Q6ZIhL2hb4dotS',
        payment_method: 'wallet',
        payment_provider: 'mobikwik',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-22T12:23:45.014Z',
        updated_at: '2025-04-22T12:24:56.137267Z',
      },
    ],
    refunds: [],
    order_source: {
      source: 'search',
      referrer: 'https://www.google.com/',
      landing_page: '/products/bassheads-100',
    },
    delivery_status: 'Your order has been shipped and is on its way',
    merchant_name: 'Urban Fashion',
  },
  {
    order_number: 'KWIK06VC77MN5543210',
    shopify_order_name: '#7925275',
    order_status: 'confirmed',
    payment_status: true,
    payment_method: 'Credit Card',
    payment_provider: 'snapmint',
    payment_at: '2025-04-24T10:15:22.014Z',
    total_amount: 2999,
    original_price: 3999,
    discount_details: {
      coupon_code: 'NEW1000',
      discount_amount: 1000,
      prepaid_discount: '0%',
      final_price: 2999,
    },
    currency: 'INR',
    fulfilled: 'unfulfilled',
    customer: {
      name: 'Chirag Taneja',
      email: 'c@gokwik.co',
      phone: '9871454433',
      address: {
        line1: '15, Silicon Valley Apartments',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'Frido 3D Posture Plus Ergonomic Chair',
        sku: '8905650076892',
        quantity: 1,
        price: 3999,
        image:
          'https://cdn.shopify.com/s/files/1/0553/0419/2034/files/Ergo-chair-grey-01_7d36b089-4d03-4b81-8557-00f376e4a722.jpg?v=1739886360&width=2160',
      },
    ],
    shipping: {
      method: 'Standard Shipping',
      estimated_delivery: '2025-04-28 14:00:00 +0530',
    },
    transactions: [
      {
        amount: 2999,
        payment_id: 'pay_R1ZklO4F5d9qsL',
        payment_method: 'card',
        payment_provider: 'snapmint',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-24T10:15:22.014Z',
        updated_at: '2025-04-24T10:16:15.137267Z',
      },
    ],
    refunds: [],
    order_source: {
      source: 'direct',
      referrer: 'https://www.youtube.com/',
      landing_page: '/products/stone-1500f',
    },
    delivery_status: 'Your order is confirmed and will be shipped soon',
    merchant_name: 'Urban Fashion',
  },
  {
    order_number: 'KWIK07DF34JK9876123',
    shopify_order_name: '#7925276',
    order_status: 'returned',
    payment_status: true,
    payment_method: 'UPI',
    payment_provider: 'gpay',
    payment_at: '2025-04-19T08:45:11.014Z',
    total_amount: 5499,
    original_price: 6499,
    discount_details: {
      coupon_code: 'FLAT1000',
      discount_amount: 1000,
      prepaid_discount: '0%',
      final_price: 5499,
    },
    currency: 'INR',
    fulfilled: 'returned',
    customer: {
      name: 'Chirag Taneja',
      email: 'c@gokwik.co',
      phone: '9871454433',
      address: {
        line1: '15, Silicon Valley Apartments',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'boAt Watch Prime with 1.69" HD Display & Multiple Sports Modes',
        sku: '8905650087654',
        quantity: 1,
        price: 6499,
        image:
          'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTQ__NXJdOiqPh9tZmnSCctOGKH7QCagAYhlPOO_SzGAMA1gEl24KxsXx8QmK61VVxN11GDN68P3o0U-HeT20sfdWt2tvj65Va6VoGhCPJ3LD-UommJRLq3',
      },
    ],
    shipping: {
      method: 'Express Shipping',
      estimated_delivery: '2025-04-21 10:00:00 +0530',
    },
    transactions: [
      {
        amount: 5499,
        payment_id: 'pay_R7CvHu8N2p3KlX',
        payment_method: 'upi',
        payment_provider: 'gpay',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-19T08:45:11.014Z',
        updated_at: '2025-04-19T08:46:05.137267Z',
      },
    ],
    refunds: [
      {
        refund_id: 'RKWIK9ZXS4Y7P8712345MP',
        amount: 5499,
        refund_type: 'Full',
        status: 'Success',
        status_description: 'Refund Processed Successfully',
        created_at: '2025-04-19T14:23:35.213574Z',
        refunded_at: '2025-04-21T16:30:26.675Z',
        payment_provider: 'gpay',
        arn_number: 'ARN76543210987654',
      },
    ],
    order_source: {
      source: 'affiliate',
      referrer: 'https://www.myntra.com/',
      landing_page: '/products/watch-prime',
    },
    delivery_status: 'Your order was picked up successfully and refund has been processed',
    merchant_name: 'Urban Fashion',
  },
  {
    order_number: 'KWIK08GH56TY7654321',
    shopify_order_name: '#7925277',
    order_status: 'shipped',
    payment_status: true,
    payment_method: 'Credit Card',
    payment_provider: 'hdfc',
    payment_at: '2025-04-21T17:32:45.014Z',
    total_amount: 7999,
    original_price: 9999,
    discount_details: {
      coupon_code: 'SAVE2000',
      discount_amount: 2000,
      prepaid_discount: '0%',
      final_price: 7999,
    },
    currency: 'INR',
    fulfilled: 'partially_fulfilled',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210',
      address: {
        line1: '42, Park Avenue, Near Central Mall',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'boAt Immortal 1000D Gaming Headphone with 7.1 Channel Sound',
        sku: '8905650098765',
        quantity: 1,
        price: 9999,
        image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/immortal-1000d.png',
      },
    ],
    shipping: {
      method: 'Premium Shipping',
      estimated_delivery: '2025-04-24 12:00:00 +0530',
    },
    transactions: [
      {
        amount: 7999,
        payment_id: 'pay_S2FgRt5K7j8nM9',
        payment_method: 'card',
        payment_provider: 'hdfc',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-21T17:32:45.014Z',
        updated_at: '2025-04-21T17:33:55.137267Z',
      },
    ],
    refunds: [],
    order_source: {
      source: 'direct',
      referrer: 'https://www.google.com/',
      landing_page: '/products/immortal-1000d',
    },
    delivery_status: 'Your order has been shipped and will reach you soon',
    merchant_name: 'Urban Fashion',
  },
  {
    order_number: 'KWIK09JK78LM4321567',
    shopify_order_name: '#7925278',
    order_status: 'delivered',
    payment_status: true,
    payment_method: 'Wallet',
    payment_provider: 'paytm',
    payment_at: '2025-04-17T09:12:34.014Z',
    total_amount: 1299,
    original_price: 1999,
    discount_details: {
      coupon_code: 'EXTRA700',
      discount_amount: 700,
      prepaid_discount: '0%',
      final_price: 1299,
    },
    currency: 'INR',
    fulfilled: 'fulfilled',
    customer: {
      name: 'Biswajit Sarmah',
      email: 'sarmahb06@gmail.com',
      phone: '6001459296',
      address: {
        line1:
          "Mahindra and Mahindra financial services LtdK B road, Domino's Building 3rd floor, Near Dos & Co Pin-785001",
        city: 'JORHAT',
        state: 'ASSAM',
        pincode: '785001',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'boAt Airdopes 131 True Wireless Earbuds with 40H Playtime',
        sku: '8905650123456',
        quantity: 1,
        price: 1999,
        image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/airdopes-131.png',
      },
    ],
    shipping: {
      method: 'Standard Shipping',
      estimated_delivery: '2025-04-20 16:00:00 +0530',
    },
    transactions: [
      {
        amount: 1299,
        payment_id: 'pay_T4HiSu6L8k9nO0',
        payment_method: 'wallet',
        payment_provider: 'paytm',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-17T09:12:34.014Z',
        updated_at: '2025-04-17T09:13:25.137267Z',
      },
    ],
    refunds: [
      {
        refund_id: 'RKWIK2YTS9X8W7654321MP',
        amount: 1299,
        refund_type: 'Full',
        status: 'Success',
        status_description: 'Refund Processed Successfully',
        created_at: '2025-04-18T10:23:35.213574Z',
        refunded_at: '2025-04-20T14:30:26.675Z',
        payment_provider: 'paytm',
        arn_number: 'ARN98765432109876',
      },
    ],
    order_source: {
      source: 'social',
      referrer: 'https://www.instagram.com/',
      landing_page: '/products/airdopes-131',
    },
    delivery_status: 'Your order has been delivered successfully',
    merchant_name: 'Urban Fashion',
  },
  {
    order_number: 'KWIK10LM98NP2468135',
    shopify_order_name: '#7925279',
    order_status: 'delivered',
    payment_status: true,
    payment_method: 'Credit Card',
    payment_provider: 'razorpay',
    payment_at: '2025-04-18T14:25:36.014Z',
    total_amount: 2499,
    original_price: 3499,
    discount_details: {
      coupon_code: 'GET1000',
      discount_amount: 1000,
      prepaid_discount: '0%',
      final_price: 2499,
    },
    currency: 'INR',
    fulfilled: 'fulfilled',
    customer: {
      name: 'Chirag Taneja',
      email: 'c@gokwik.co',
      phone: '9871454433',
      address: {
        line1: '15, Silicon Valley Apartments',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'boAt Rockerz 450 Pro Bluetooth Headphone with 70H Playtime',
        sku: '8905650034567',
        quantity: 1,
        price: 3499,
        image:
          'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRgWyn_MbJ0J2nzUmBiHLQecX2dVSpUBCJ4Matek5VqbEAMmhe5LzewJMqPKdPmXXDwWVQfjpLWmPEuIWp8KS7T8iujFB8U4egMFh7hShZoy343K2m2kXkH42G1PP596u-JXkKBVsk&usqp=CAc',
      },
    ],
    shipping: {
      method: 'Standard Shipping',
      estimated_delivery: '2025-04-22 16:00:00 +0530',
    },
    transactions: [
      {
        amount: 2499,
        payment_id: 'pay_U8VkMs9L6p2QrT',
        payment_method: 'card',
        payment_provider: 'razorpay',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-18T14:25:36.014Z',
        updated_at: '2025-04-18T14:26:48.137267Z',
      },
    ],
    refunds: [],
    order_source: {
      source: 'direct',
      referrer: 'https://www.google.com/',
      landing_page: '/products/rockerz-450-pro',
    },
    delivery_status: 'Your order has been delivered successfully',
    merchant_name: 'Urban Fashion',
  },
  {
    order_number: 'KWIK11NP57QR3579246',
    shopify_order_name: '#7925280',
    order_status: 'shipped',
    payment_status: true,
    payment_method: 'UPI',
    payment_provider: 'phonepe',
    payment_at: '2025-04-24T11:38:27.014Z',
    total_amount: 1799,
    original_price: 2499,
    discount_details: {
      coupon_code: 'SAVE700',
      discount_amount: 700,
      prepaid_discount: '0%',
      final_price: 1799,
    },
    currency: 'INR',
    fulfilled: 'partially_fulfilled',
    customer: {
      name: 'Chirag Taneja',
      email: 'c@gokwik.co',
      phone: '9871454433',
      address: {
        line1: '15, Silicon Valley Apartments',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'Color Block Loafers : White-Green',
        sku: '8905650045678',
        quantity: 1,
        price: 2499,
        image: 'https://neemans.com/cdn/shop/files/ND-CBL-GreenWhite-_WebOptimized_d.jpg?v=1726144112&width=800',
      },
    ],
    shipping: {
      method: 'Express Shipping',
      estimated_delivery: '2025-04-27 11:00:00 +0530',
    },
    transactions: [
      {
        amount: 1799,
        payment_id: 'pay_V3TjRw4M7q1PsU',
        payment_method: 'upi',
        payment_provider: 'phonepe',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-24T11:38:27.014Z',
        updated_at: '2025-04-24T11:39:42.137267Z',
      },
    ],
    refunds: [],
    order_source: {
      source: 'direct',
      referrer: 'https://www.google.com/',
      landing_page: '/products/airdopes-441-pro',
    },
    delivery_status: 'Your order has been shipped and is in transit',
    merchant_name: 'Urban Fashion',
  },
  {
    order_number: 'KWIK12RS68TU4680357',
    shopify_order_name: '#7925281',
    order_status: 'cancelled',
    payment_status: true,
    payment_method: 'Net Banking',
    payment_provider: 'icici',
    payment_at: '2025-04-22T15:47:53.014Z',
    total_amount: 3999,
    original_price: 4999,
    discount_details: {
      coupon_code: 'FIRST1000',
      discount_amount: 1000,
      prepaid_discount: '0%',
      final_price: 3999,
    },
    currency: 'INR',
    fulfilled: 'cancelled',
    customer: {
      name: 'Chirag Taneja',
      email: 'c@gokwik.co',
      phone: '9871454433',
      address: {
        line1: '15, Silicon Valley Apartments',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'Chandler',
        sku: '8905650056789',
        quantity: 1,
        price: 4999,
        image:
          'https://cdn.shopify.com/s/files/1/1276/5299/products/g_5730.jpg?v=1629965361?t=1629965970?v=1745646385736',
      },
    ],
    shipping: {
      method: 'Standard Shipping',
      estimated_delivery: '2025-04-26 15:00:00 +0530',
    },
    transactions: [
      {
        amount: 3999,
        payment_id: 'pay_W5YnSx6N8r3QtV',
        payment_method: 'netbanking',
        payment_provider: 'icici',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-22T15:47:53.014Z',
        updated_at: '2025-04-22T15:48:36.137267Z',
      },
    ],
    refunds: [
      {
        refund_id: 'RKWIK7VUR3S2Q1098765MP',
        amount: 3999,
        refund_type: 'Full',
        status: 'Success',
        status_description: 'Refund Processed Successfully',
        created_at: '2025-04-22T18:23:35.213574Z',
        refunded_at: '2025-04-24T14:30:26.675Z',
        payment_provider: 'icici',
        arn_number: 'ARN98714544331234',
      },
    ],
    order_source: {
      source: 'direct',
      referrer: 'https://www.amazon.in/',
      landing_page: '/products/aavante-bar-1800',
    },
    delivery_status: 'Your order was cancelled before shipping. Refund has been processed.',
    merchant_name: 'Urban Fashion',
  },
  {
    order_number: 'KWIK06ADNC0000001',
    shopify_order_name: '#7925275',
    order_status: 'not_confirmed',
    payment_status: true,
    payment_method: 'UPI',
    payment_provider: 'paytm',
    payment_at: '2025-04-28T10:00:00.000Z',
    total_amount: 1299,
    original_price: 1499,
    discount_details: {
      coupon_code: 'ADONC100',
      discount_amount: 200,
      prepaid_discount: '0%',
      final_price: 1299,
    },
    currency: 'INR',
    fulfilled: 'unfulfilled',
    customer: {
      name: 'Chirag Taneja',
      email: 'deepak.singh@example.com',
      phone: '9123456780',
      address: {
        line1: '22, Sunrise Apartments, Sector 21',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        country: 'IN',
      },
    },
    items: [
      {
        name: 'Anti-Hair Fall Spa Kit',
        sku: 'SPK123456',
        quantity: 1,
        price: 1499,
        image: 'https://images.mamaearth.in/catalog/product/1/_/1_white_bg_31.jpg?format=auto&height=600',
      },
    ],
    shipping: {
      method: 'Standard Shipping',
      estimated_delivery: '2025-05-02 10:00:00 +0530',
    },
    transactions: [
      {
        amount: 1299,
        payment_id: 'KWIKADNC0001',
        payment_method: 'upi',
        payment_provider: 'paytm',
        status: 'success',
        bank_status: 'payment_successful',
        created_at: '2025-04-28T10:00:00.000Z',
        updated_at: '2025-04-28T10:01:00.000Z',
      },
    ],
    refunds: [
      {
        refund_id: 'RKWIK7VUR3S3Q1098765MP',
        amount: 1299,
        refund_type: 'Full',
        status: 'Success',
        status_description: 'Refund Processed Successfully',
        created_at: '2025-04-22T18:23:35.213574Z',
        refunded_at: '2025-04-24T14:30:26.675Z',
        payment_provider: 'paytm',
        arn_number: 'ARN98714544387234',
      },
    ],
    order_source: {
      source: 'direct',
      referrer: 'https://www.example.com/',
      landing_page: '/products/speaker',
    },
    delivery_status: 'Order not confirmed. Payment received but order was not created.',
    merchant_name: 'SoundTech',
    refund_status: null,
  },
];

export const customerOrdersMap = new Map<string, Order[]>([
  ['6001459296', [mockOrders[0], mockOrders[8]]],
  ['9876543210', [mockOrders[1], mockOrders[7]]],
  ['8765432109', [mockOrders[2]]],
  ['7654321098', [mockOrders[3]]],
  ['9012345678', [mockOrders[4]]],
  [
    '9871454433',
    [mockOrders[5], mockOrders[6], mockOrders[12], mockOrders[3], mockOrders[9], mockOrders[10], mockOrders[11]],
  ],
]);
