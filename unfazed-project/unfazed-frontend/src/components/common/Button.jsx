export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-card text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-moss-600 text-white hover:bg-moss-700',
    secondary: 'bg-white text-ink border border-line hover:border-moss-500',
    ghost: 'text-moss-700 hover:bg-moss-50',
    danger: 'bg-clay text-white hover:opacity-90',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
