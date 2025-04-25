
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CustomerDashboard } from '@/components/CustomerDashboard';

const Index = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, limit to 10 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
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
        title: "Invalid OTP",
        description: "Please enter the correct OTP",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      await login(phone);
      toast({
        title: "Success!",
        description: "You have been logged in successfully",
      });
      // No navigation now - we'll stay on the same page and show the dashboard
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Render customer dashboard if authenticated
  if (isAuthenticated) {
    return <CustomerDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#021142] text-white">
      {/* Header */}
      <header className="p-4 flex items-center">
        <img 
          src="public/lovable-uploads/d897a68a-3056-489a-8e57-a6d7fcf77aad.png" 
          alt="GoKwik Logo" 
          className="h-8"
        />
        <div className="ml-auto space-x-6 hidden md:block">
          <a href="#" className="hover:text-yellow-400">Why GoKwik</a>
          <a href="#" className="hover:text-yellow-400">Products</a>
          <a href="#" className="hover:text-yellow-400">Knowledge & News</a>
          <a href="#" className="hover:text-yellow-400">Support Centre</a>
          <a href="#" className="hover:text-yellow-400">Careers</a>
          <a href="#" className="hover:text-yellow-400">Contact Us</a>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap">
          {/* Left Side */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold mb-6">
              The Only <span className="text-orange-500">D2C</span> Growth Partner You'll Ever Need.
            </h1>
            
            <div className="space-y-6 mt-8">
              <div>
                <h2 className="text-xl font-bold text-orange-500">Kwik Checkout –</h2>
                <p>Up to 40% conversion uplift with seamless checkout.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-500">Kwik Pass –</h2>
                <p>Identify 25% of anonymous shoppers and engage with them.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-500">Kwik Engage –</h2>
                <p>Achieve 20X ROAS with personalized multi-channel engagement.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-500">Kwik Kart –</h2>
                <p>20% more upsell with smart slide cart customizations.</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-500">Return Prime –</h2>
                <p>Achieve 8% higher revenue from returns and exchanges.</p>
              </div>
            </div>
          </div>

          {/* Right Side - Cards */}
          <div className="w-full md:w-1/2 flex flex-col md:flex-row flex-wrap gap-6 items-start justify-center">
            {/* Brand Card */}
            <div className="w-full max-w-xs h-40 bg-white rounded-lg text-center p-6 text-gray-800 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <h3 className="text-xl mb-2">Are You A</h3>
                <p className="text-2xl font-bold text-[#021142]">Brand?</p>
              </div>
            </div>
            
            {/* Customer Card */}
            <div className="w-full max-w-xs bg-orange-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <h3 className="text-xl mb-2">Are You A</h3>
                <p className="text-2xl font-bold text-[#021142]">Customer?</p>
              </div>
              
              {/* Customer Login Form */}
              {step === 'phone' ? (
                <form onSubmit={handlePhoneSubmit} className="mt-4">
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="mb-2 bg-white text-gray-800"
                  />
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    Get OTP
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="mt-4">
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mb-2 bg-white text-gray-800"
                    maxLength={6}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Login"}
                  </Button>
                  <p className="text-xs mt-1 text-gray-700">Use 123456 for testing</p>
                </form>
              )}
            </div>
            
            {/* Agency Card */}
            <div className="w-full max-w-xs h-40 bg-white rounded-lg text-center p-6 text-gray-800 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <h3 className="text-xl mb-2">Are You An</h3>
                <p className="text-2xl font-bold text-[#021142]">Agency?</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Index;
