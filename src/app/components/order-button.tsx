'use client'
import { useEffect, useState } from 'react';
import { createOrder } from "../actions";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function OrderButton({
  food,
}: {
  food: {
    id: string;
    name: string;
    img: string;
    amount: number;
    currency: string;
  };
}) {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Razorpay is still loading');
      return;
    }

    try {
      if(!food) throw new Error("Food is Not Avaliable")
      const userId = localStorage.getItem('user-id');
      if(!userId) throw new Error('user not logged in')
      const data = await createOrder({food, userId});
      console.log(data);

      if (!data.success) throw new Error('Order creation failed');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order?.amount,
        currency: data.order?.currency,
        order_id: data.order?.id,
        name: 'Food Ordering App',
        description: `Order for ${food?.name}`,
        handler: (response: any) => {
          console.log('Payment successful:', response);
          alert('Payment Successful');
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment Failed');
    }
  };

  return (
    <button
      className="w-full py-2 bg-white text-black rounded-lg"
      onClick={handlePayment}
    >
      Buy
    </button>
  );
}