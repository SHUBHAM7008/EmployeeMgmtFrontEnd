import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/api/employees';

const styles = {
  container: {
    maxWidth: 1400,
    margin: '48px auto',
    padding: '20px 24px',
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    color: '#222',
    background: 'linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: 16,
    boxShadow: '0 6px 32px rgba(44, 62, 80, 0.08)',
  },
  title: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 32,
    color: '#144272',
    letterSpacing: 1,
    textShadow: '0 2px 8px rgba(44, 62, 80, 0.05)',
  },
  searchInput: {
    width: '100%',
    maxWidth: 420,
    display: 'block',
    margin: '0 auto 36px auto',
    padding: '12px 18px',
    fontSize: 17,
    border: '2px solid #b0bec5',
    borderRadius: 8,
    backgroundColor: '#f7fafc',
    boxShadow: '0 1px 3px rgba(44,62,80,0.04)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  tableContainer: {
    maxHeight: 420,
    overflowY: 'auto',
    marginBottom: 48,
    border: '1px solid #e0e4ea',
    borderRadius: 10,
    backgroundColor: '#f8fbff',
    boxShadow: '0 3px 10px rgba(44,62,80,0.07)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 16,
    background: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  th: {
    background: '#3498db',
    color: '#fff',
    fontWeight: 700,
    padding: '14px 12px',
    textAlign: 'left',
  },
  td: {
    padding: '12px 12px',
    borderBottom: '1px solid #e0e4ea',
    background: '#f9f9f9',
  },
  actionTd: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: '12px 12px',
    borderBottom: '1px solid #e0e4ea',
    background: '#f9f9f9',
  },
  button: {
    marginTop: 0,
    width: 90,
    padding: '6px 12px',
    border: 'none',
    borderRadius: 5,
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
    transition: 'background-color 0.22s, box-shadow 0.22s',
    boxShadow: '0 2px 6px rgba(52,152,219,0.07)',
    outline: 'none',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  editButton: {
    backgroundColor: '#5c6bc0',
    color: 'white',
    opacity: 0.92,
  },
  addForm: {
    maxWidth: 550,
    margin: '0 auto 60px auto',
    backgroundColor: '#fff',
    padding: '30px 36px',
    borderRadius: 14,
    boxShadow: '0 4px 16px rgba(44,62,80,0.09)',
    border: '1px solid #e0e4ea',
  },
  formInput: {
    width: '95%',
    padding: '14px 11px',
    marginBottom: 22,
    fontSize: 17,
    border: '2px solid #b0bec5',
    borderRadius: 8,
    backgroundColor: '#f7fafc',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  submitButton: {
    width: '100%',
    padding: '14px 0',
    fontSize: 19,
    fontWeight: 700,
    background: 'linear-gradient(120deg, #FF5733 0%, #a1e5f3 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(52,152,219,0.11)',
    transition: 'background-color 0.22s, box-shadow 0.22s',
  },
  cancelButton: {
    marginTop: 12,
    width: '100%',
    padding: '14px 0',
    fontSize: 18,
    fontWeight: 700,
    backgroundColor: '#cfd8dc',
    color: '#333',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'background-color 0.22s',
  },
  addButton: {
    display: 'block',
    margin: '18px auto 26px auto',
    padding: '12px 28px',
    fontSize: 17,
    borderRadius: 8,
    background: 'linear-gradient(90deg, #2ecc71 60%, #27ae60 100%)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 2px 10px rgba(46,204,113,0.10)',
    transition: 'background 0.22s, box-shadow 0.22s',
  },
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [mode, setMode] = useState('list'); // 'list' | 'add' | 'edit'
  const [form, setForm] = useState({ name: '', email: '', department: '', salary: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      alert('Failed to fetch employees');
    }
  }

  const filteredEmployees = employees.filter(emp => {
    const lower = filterText.toLowerCase();
    return (
      emp.name.toLowerCase().includes(lower) || emp.department.toLowerCase().includes(lower)
    );
  });

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchEmployees();
  }

  function openAddForm() {
    setForm({ name: '', email: '', department: '', salary: '' });
    setMode('add');
  }

  function openEditForm(emp) {
    setForm({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      salary: emp.salary,
    });
    setEditId(emp.id);
    setMode('edit');
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setMode('list');
    fetchEmployees();
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    await fetch(`${API_URL}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setMode('list');
    setEditId(null);
    fetchEmployees();
  }

  function handleCancel() {
    setMode('list');
    setEditId(null);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Employee Management System</h1>

      {mode === 'list' && (
        <>
          <input
            type="text"
            placeholder="Search by name or department..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            style={styles.searchInput}
          />

        
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Salary</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ ...styles.td, textAlign: "center" }}>No employees found.</td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td style={styles.td}>{emp.name}</td>
                      <td style={styles.td}>{emp.email}</td>
                      <td style={styles.td}>{emp.department}</td>
                      <td style={styles.td}>{emp.salary}</td>
                      <td style={styles.actionTd}>
                        <button
                          style={{ ...styles.button, ...styles.editButton }}
                          onClick={() => openEditForm(emp)}
                        >
                          Edit
                        </button>
                        <button
                          style={{ ...styles.button, ...styles.deleteButton }}
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
          </div>
          <button onClick={openAddForm} style={styles.addButton}>
            Add Employee
          </button>
        </>
      )}

      {(mode === 'add' || mode === 'edit') && (
        <form
          onSubmit={mode === 'add' ? handleAddSubmit : handleEditSubmit}
          style={styles.addForm}
        >
          <h2>{mode === 'add' ? 'Add New Employee' : 'Update Employee'}</h2>
          <input
            style={styles.formInput}
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            style={styles.formInput}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={styles.formInput}
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })}
            required
          />
          <input
            style={styles.formInput}
            type="number"
            placeholder="Salary"
            value={form.salary}
            onChange={e => setForm({ ...form, salary: e.target.value })}
            required
          />
          <button type="submit" style={styles.submitButton}>
            {mode === 'add' ? 'Add Employee' : 'Update Employee'}
          </button>
          <button type="button" onClick={handleCancel} style={styles.cancelButton}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
