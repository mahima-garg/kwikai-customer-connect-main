
import React, { createContext, useContext, useState } from 'react';
import { Customer } from '@/types';
import { mockCustomers } from '@/data/mockCustomers';
import { customerOrdersMap, Order as DetailedOrder } from '@/data/mockOrders';

interface AuthContextType {
  isAuthenticated: boolean;
  customer: Customer | null;
  detailedOrders: DetailedOrder[];
  login: (phone: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [detailedOrders, setDetailedOrders] = useState<DetailedOrder[]>([]);

  const login = async (phone: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockCustomer = mockCustomers.get(phone);
    const orders = customerOrdersMap.get(phone) || [];
    
    if (mockCustomer) {
      setCustomer(mockCustomer);
      setDetailedOrders(orders);
      setIsAuthenticated(true);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setCustomer(null);
    setDetailedOrders([]);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, customer, detailedOrders, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
