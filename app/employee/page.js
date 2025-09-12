'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Employees.module.css';

export default function Employees() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState([
    { name: "John Doe", email: "john@example.com", position: "Software Engineer" },
    { name: "Jane Smith", email: "jane@example.com", position: "Product Manager" },
    { name: "Mike Johnson", email: "mike@example.com", position: "UX Designer" }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: ""
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setEmployees([...employees, formData]);
    setFormData({ name: "", email: "", position: "" });
    setShowForm(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Employees</h1>

        <div className={styles.controls}>
          <button className={styles.addEmployeeBtn} onClick={() => setShowForm(true)}>
            Add Employee
          </button>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search employees..."
          />
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={index}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add New Employee</h2>
            <form onSubmit={handleAddEmployee} className={styles.form}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={formData.position}
                onChange={handleChange}
                required
              />
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>Save</button>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
