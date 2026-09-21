import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export default function Register() {
  const { register: registerField, handleSubmit } = useForm();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function onSubmit(data) {
    setError('');
    try {
      await register(data);
      navigate('/therapist/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl mb-1">Set up your practice</h1>
        <p className="text-ink/60 text-sm mb-6">Your branded link is generated automatically from your name.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-ink/70">Full name</label>
            <input {...registerField('name', { required: true })} className="mt-1 w-full border border-line rounded-card px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="text-sm text-ink/70">Email</label>
            <input type="email" {...registerField('email', { required: true })} className="mt-1 w-full border border-line rounded-card px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="text-sm text-ink/70">Password</label>
            <input type="password" {...registerField('password', { required: true, minLength: 6 })} className="mt-1 w-full border border-line rounded-card px-3 py-2 bg-white" />
          </div>
          {error && <p className="text-clay text-sm">{error}</p>}
          <Button type="submit" className="w-full">Create account</Button>
        </form>
        <p className="text-sm text-ink/60 mt-4">
          Already have an account? <Link to="/login" className="text-moss-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
