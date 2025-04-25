import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { login } = useAuth();
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
    if (!captchaVerified) {
      toast({
        title: "Verification required",
        description: "Please complete the reCAPTCHA verification",
        variant: "destructive",
      });
      return;
    }
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
      navigate('/dashboard');
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

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="flex-1 bg-[#0B1C48] p-12">
        <div className="mb-20">
          <img src="/gokwik-logo-white.svg" alt="GoKwik" className="h-8" />
        </div>
        <div className="text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-8">
            The Only <span className="text-[#F5A623]">D2C</span> Growth Partner You'll Ever Need.
          </h1>
          <div className="space-y-6">
            <div>
              <h3 className="text-[#F5A623] text-xl font-semibold mb-2">Kwik Checkout –</h3>
              <p>Up to 40% conversion uplift with seamless checkout.</p>
            </div>
            <div>
              <h3 className="text-[#F5A623] text-xl font-semibold mb-2">Kwik Pass –</h3>
              <p>Identify 25% of anonymous shoppers and engage with them.</p>
            </div>
            <div>
              <h3 className="text-[#F5A623] text-xl font-semibold mb-2">Kwik Engage –</h3>
              <p>Achieve 20X ROAS with personalized multi-channel engagement.</p>
            </div>
            <div>
              <h3 className="text-[#F5A623] text-xl font-semibold mb-2">Kwik Kart –</h3>
              <p>20% more upsell with smart slide cart customizations.</p>
            </div>
            <div>
              <h3 className="text-[#F5A623] text-xl font-semibold mb-2">Return Prime –</h3>
              <p>Achieve 8% higher revenue from returns and exchanges.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-[600px] bg-[#F5A623] p-12">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-[#0B1C48] mb-4">
            Are You A Customer?
          </h2>
          <p className="text-gray-600 mb-8">
            Check the status of orders you have made in the past 6 months. View using your phone number.
          </p>
          
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Your Mobile Number*
                </label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-center mb-4">
                <ReCAPTCHA
                  sitekey="your-recaptcha-site-key"
                  onChange={handleCaptchaChange}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#F5A623] hover:bg-[#E69512] text-white"
                disabled={!captchaVerified}
              >
                Get OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Verify your phone number
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Please enter the OTP sent to {phone}
                </p>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500">
                  Use 123456 as the OTP for testing
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#F5A623] hover:bg-[#E69512] text-white"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
