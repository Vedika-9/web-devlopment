import { useState } from 'react';
import api from '../../api/axiosInstance';
import Button from '../common/Button';

// Loads Razorpay checkout.js and opens the payment modal for a given order.
export default function CheckoutForm({ slug, clientId, amount, purpose, packageId, onSuccess }) {
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    const { data } = await api.post(`/payments/${slug}/order`, { clientId, amount, purpose, packageId });

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: 'Unfazed',
        handler: async (response) => {
          await api.post('/payments/verify', {
            paymentId: data.paymentId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (purpose === 'package') {
            await api.post('/payments/credit-package', { paymentId: data.paymentId, packageId });
          }
          onSuccess?.();
        },
      });
      rzp.open();
      setLoading(false);
    };
    document.body.appendChild(script);
  }

  return (
    <Button onClick={pay} disabled={loading}>
      {loading ? 'Loading checkout…' : `Pay ₹${(amount / 100).toFixed(2)}`}
    </Button>
  );
}
