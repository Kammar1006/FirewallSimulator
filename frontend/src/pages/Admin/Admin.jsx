import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStudent, setNewStudent] = useState({
    id: '',
    lastName: '',
    firstName: '',
    progress: [0, 0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken === 'admin') {
      setIsAuthenticated(true);
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5003/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data);
      setError('');
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('adminToken', 'admin');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setError('');
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5003/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add student');
      }

      setNewStudent({
        id: '',
        lastName: '',
        firstName: '',
        progress: [0, 0, 0, 0, 0, 0]
      });
      fetchStudents();
      setError('');
    } catch (error) {
      console.error('Error adding student:', error);
      setError(error.message);
    }
  };

  const handleUpdateProgress = async (studentId, taskIndex, value) => {
    try {
      const response = await fetch(`http://localhost:5003/students/${studentId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskIndex, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      fetchStudents();
      setError('');
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input type="text" name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      {error && <p className="error">{error}</p>}
      
      <div className="add-student">
        <h3>Add New Student</h3>
        <form onSubmit={handleAddStudent}>
          <input
            type="text"
            placeholder="Student ID"
            value={newStudent.id}
            onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newStudent.lastName}
            onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={newStudent.firstName}
            onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
            required
          />
          <button type="submit">Add Student</button>
        </form>
      </div>

      <div className="students-list">
        <h3>Students</h3>
        {loading ? (
          <p className="loading">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="no-students">No students found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Task 1</th>
                <th>Task 2</th>
                <th>Task 3</th>
                <th>Task 4</th>
                <th>Task 5</th>
                <th>Task 6</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{`${student.firstName} ${student.lastName}`}</td>
                  {student.progress.map((progress, index) => (
                    <td key={index}>
                      <button
                        onClick={() => handleUpdateProgress(student.id, index, progress === 0 ? 1 : 0)}
                        className={progress === 1 ? 'completed' : 'not-completed'}
                      >
                        {progress === 1 ? '✓' : '✗'}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin; 