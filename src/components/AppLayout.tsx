import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className='min-h-screen bg-[#021142] text-white'>
      {/* Header */}
      <header className='p-4 flex items-center'>
        <img
          src='https://www.gokwik.co/assets/images/logo@2x.png'
          alt='GoKwik Logo'
          className='h-8'
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
        <div className='ml-auto space-x-6 hidden md:block'>
          <a href='#' className='hover:text-yellow-400'>
            Why GoKwik
          </a>
          <a href='#' className='hover:text-yellow-400'>
            Products
          </a>
          <a href='#' className='hover:text-yellow-400'>
            Knowledge & News
          </a>
          <a href='#' className='hover:text-yellow-400'>
            Support Centre
          </a>
          <a href='#' className='hover:text-yellow-400'>
            Careers
          </a>
          <a href='#' className='hover:text-yellow-400'>
            Contact Us
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='flex flex-wrap'>
          {/* Left Side - Static Content */}
          <div className='w-full md:w-1/2 mb-8 md:mb-0 pr-4'>
            <h1 className='text-4xl font-bold mb-6'>
              The Only <span className='text-orange-500'>D2C</span> Growth Partner You'll Ever Need.
            </h1>

            <div className='space-y-6 mt-8'>
              <div>
                <h2 className='text-xl font-bold text-orange-500'>Kwik Checkout –</h2>
                <p>Up to 40% conversion uplift with seamless checkout.</p>
              </div>
              <div>
                <h2 className='text-xl font-bold text-orange-500'>Kwik Pass –</h2>
                <p>Identify 25% of anonymous shoppers and engage with them.</p>
              </div>
              <div>
                <h2 className='text-xl font-bold text-orange-500'>Kwik Engage –</h2>
                <p>Achieve 20X ROAS with personalized multi-channel engagement.</p>
              </div>
              <div>
                <h2 className='text-xl font-bold text-orange-500'>Kwik Kart –</h2>
                <p>20% more upsell with smart slide cart customizations.</p>
              </div>
              <div>
                <h2 className='text-xl font-bold text-orange-500'>Return Prime –</h2>
                <p>Achieve 8% higher revenue from returns and exchanges.</p>
              </div>
            </div>
          </div>

          {/* Right Side - Dynamic Content */}
          <div className='w-full md:w-1/2 bg-gray-50 text-gray-800 rounded-lg shadow-lg p-6'>
            {isAuthenticated && (
              <div className='flex items-center justify-between mb-6 pb-4 border-b'>
                <div className='flex space-x-4'>
                  <Button
                    variant={isActive('/dashboard') ? 'default' : 'outline'}
                    onClick={() => navigate('/dashboard')}
                    className={isActive('/dashboard') ? 'bg-blue-900' : ''}
                  >
                    My Orders
                  </Button>
                </div>
                <Button variant='outline' onClick={logout}>
                  Logout
                </Button>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
