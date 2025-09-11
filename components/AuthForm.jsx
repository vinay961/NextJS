'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthForm({ mode = 'register' }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const url = mode === 'register' ? '/api/register' : '/api/login';
    const body =
      mode === 'register'
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Something went wrong');

    router.push('/dashboard');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h1
          style={{
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          {mode === 'register' ? 'Create Account' : 'Welcome Back'}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.9rem', color: '#555' }}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  color: '#333',
                  width: '100%',
                  padding: '0.6rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  marginTop: '0.3rem',
                }}
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.9rem', color: '#555' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                color: '#333',
                width: '100%',
                padding: '0.6rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                marginTop: '0.3rem',
              }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', color: '#555' }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{
                color: '#333',
                width: '100%',
                padding: '0.6rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                marginTop: '0.3rem',
              }}
              required
            />
          </div>

          {error && (
            <p style={{ color: 'red', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.7rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {mode === 'register' ? 'Register' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
          {mode === 'register'
            ? 'Already have an account? '
            : 'Don’t have an account yet? '}
          <a
            href={mode === 'register' ? '/login' : '/register'}
            style={{ color: '#4f46e5', textDecoration: 'underline' }}
          >
            {mode === 'register' ? 'Login' : 'Register'}
          </a>
        </p>
      </div>
    </div>
  );
}
