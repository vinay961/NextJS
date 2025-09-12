'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const res = await fetch('/api/me');
      const data = await res.json();
      if (!data.user) return router.push('/login');
      setUser(data.user);
    }
    getUser();
  }, [router]);

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome, {user.name}</h1>
        <p className={styles.text}>Your email: {user.email}</p>

        <button
          onClick={async () => {
            const res = await fetch('/api/logout', { method: 'POST' });
            if (res.ok) router.push('/login');
          }}
          className={styles.logoutBtn}
        >
          Logout
        </button>

        <button
          onClick={() => router.push('/employee')}
          className={styles.AddEmployeeBtn}
        >
          Add Employee
        </button>
      </div>
    </div>
  );
}
