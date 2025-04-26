import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/AppLayout';
import ReCAPTCHA from 'react-google-recaptcha';

const Index = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, limit to 10 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaVerified(!!value);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      });
      return;
    }

    if (!captchaVerified) {
      toast({
        title: 'Verification required',
        description: 'Please complete the reCAPTCHA verification',
        variant: 'destructive',
      });
      return;
    }

    setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (otp !== '123456') {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the correct OTP',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      await login(phone);
      toast({
        title: 'Success!',
        description: 'You have been logged in successfully',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Render authenticated content
  if (isAuthenticated) {
    return (
      <AppLayout>
        <div className='text-center'>
          <h1 className='text-3xl font-bold mb-6'>Welcome to Your Dashboard</h1>
          <p className='mb-6'>You're now logged in to your GoKwik customer account.</p>

          <div className='space-y-4'>
            <div className='p-4 bg-green-100 rounded-lg'>
              <h2 className='text-xl font-bold text-green-800'>My Orders</h2>
              <p className='text-green-700'>View and track your recent orders</p>
              <Button onClick={() => navigate('/dashboard')} className='mt-2 bg-green-600 hover:bg-green-700'>
                View Orders
              </Button>
            </div>

            {/* <div className='p-4 bg-blue-100 rounded-lg'>
              <h2 className='text-xl font-bold text-blue-800'>Transaction History</h2>
              <p className='text-blue-700'>Access your payment and refund information</p>
              <Button onClick={() => navigate('/transactions')} className='mt-2 bg-blue-600 hover:bg-blue-700'>
                View Transactions
              </Button>
            </div> */}

            <div className='p-4 bg-purple-100 rounded-lg'>
              <h2 className='text-xl font-bold text-purple-800'>Support</h2>
              <p className='text-purple-700'>Get help with any issues or questions</p>
              <Button onClick={() => navigate('/chat')} className='mt-2 bg-purple-600 hover:bg-purple-700'>
                Chat with Support
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <div className='min-h-screen bg-[#021142] text-white'>
      {/* Header */}
      <header className='p-4 flex items-center'>
        <img src='https://www.gokwik.co/assets/images/logo@2x.png' alt='GoKwik Logo' className='h-8' />
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
          {/* Left Side */}
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

          {/* Right Side - Cards */}
          <div className='w-full md:w-1/2 flex flex-col md:flex-row flex-wrap gap-6 items-start justify-center'>
            {/* Customer Card */}
            <div className='w-full max-w-md bg-orange-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow'>
              <div className='text-center mb-6'>
                <h3 className='text-2xl mb-2'>Are You A</h3>
                <p className='text-3xl font-bold text-[#021142]'>Customer?</p>
              </div>

              <p className='text-base text-gray-700 mb-6'>
                Check your order status from the past 6 months using your phone number.
              </p>

              {/* Customer Login Form */}
              {step === 'phone' ? (
                <form onSubmit={handlePhoneSubmit} className='mt-6'>
                  <Input
                    type='tel'
                    placeholder='Enter your phone number'
                    value={phone}
                    onChange={handlePhoneChange}
                    className='mb-4 bg-white text-gray-800 p-6 text-lg'
                  />
                  <div className='flex justify-center mb-4'>
                    <ReCAPTCHA sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' onChange={handleCaptchaChange} />
                  </div>
                  <Button
                    type='submit'
                    className='w-full bg-orange-500 hover:bg-orange-600 p-6 text-lg h-auto'
                    disabled={!captchaVerified}
                  >
                    Get OTP
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className='mt-6'>
                  <Input
                    type='text'
                    placeholder='Enter OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className='mb-4 bg-white text-gray-800 p-6 text-lg'
                    maxLength={6}
                  />
                  <Button
                    type='submit'
                    className='w-full bg-orange-500 hover:bg-orange-600 p-6 text-lg h-auto'
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Login'}
                  </Button>
                  <p className='text-sm mt-2 text-gray-700'>Use 123456 for testing</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
