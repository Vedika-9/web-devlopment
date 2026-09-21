import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function onSubmit(data) {
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/therapist/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl mb-1">Welcome back</h1>
        <p className="text-ink/60 text-sm mb-6">Sign in to your practice dashboard.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-ink/70">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="mt-1 w-full border border-line rounded-card px-3 py-2 bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-ink/70">Password</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="mt-1 w-full border border-line rounded-card px-3 py-2 bg-white"
            />
          </div>
          {error && <p className="text-clay text-sm">{error}</p>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
        <p className="text-sm text-ink/60 mt-4">
          New here? <Link to="/register" className="text-moss-600">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
