import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CheckoutForm from '../../components/payments/CheckoutForm';

export default function Payment() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const [done, setDone] = useState(false);
  const clientId = params.get('clientId');
  const amount = Number(params.get('amount') || 150000); // paise

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <h1 className="font-serif text-2xl mb-4">Complete your payment</h1>
      {done ? (
        <p className="text-moss-600">Payment successful — an invoice has been emailed to you.</p>
      ) : (
        <CheckoutForm slug={slug} clientId={clientId} amount={amount} purpose="session" onSuccess={() => setDone(true)} />
      )}
    </div>
  );
}
