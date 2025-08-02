import { useState, useEffect } from 'react';
import './Admin.css';

function Admin() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalGenerations: 0,
        activeUsers: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
                setStats(data.stats || {});
            } else {
                setError('Failed to fetch admin data');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setUsers(users.filter(user => user._id !== userId));
                setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
            } else {
                alert('Failed to delete user');
            }
        } catch (err) {
            alert('Network error');
        }
    };

    if (isLoading) {
        return (
            <div className="admin-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-container">
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchAdminData}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage users and monitor system statistics</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                        <h3>Total Generations</h3>
                        <p className="stat-number">{stats.totalGenerations}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🟢</div>
                    <div className="stat-content">
                        <h3>Active Users</h3>
                        <p className="stat-number">{stats.activeUsers}</p>
                    </div>
                </div>
            </div>

            <div className="users-section">
                <h2>User Management</h2>
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteUser(user._id)}
                                            disabled={user.role === 'admin'}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Admin; 