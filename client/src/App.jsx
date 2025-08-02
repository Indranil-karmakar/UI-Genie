import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Admin from './components/Admin';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children, user }) {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

// Admin Route Component
function AdminRoute({ children, user }) {
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
}

// Main Dashboard Component
function Dashboard({ user, onLogout }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('MyComponent');
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setGeneratedCode('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first!');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setGeneratedCode(data.generatedCode);
            } else {
                alert(data.error || 'Failed to generate code');
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Error while uploading image');
        } finally {
            setIsLoading(false);
        }
    };

    const downloadCode = () => {
        if (!generatedCode) return;

        const element = document.createElement('a');
        const file = new Blob([generatedCode], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        const safeName = fileName.trim() !== '' ? fileName.trim() : 'generated-component';
        element.download = `${safeName}.jsx`;

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="container">
            <div className="header">
                <h1><div className="ui-genie">UI Genie</div></h1>
                <div className="user-menu">
                    {user && (
                        <>
                            <span className="welcome-text">Welcome, {user.name}!</span>
                            {user.role === 'admin' && (
                                <button 
                                    className="admin-btn"
                                    onClick={() => navigate('/admin')}
                                >
                                    Admin
                                </button>
                            )}
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid">
                {/* Left side - File upload */}
                <div className="card">
                    <h2>Upload Image</h2>

                    {/* File input */}
                    <div className="file-input">
                        <label htmlFor="file-upload">Choose File</label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setSelectedFile(e.target.files[0]);
                                setFileName(e.target.files[0].name);
                            }}
                        />
                    </div>

                    {/* Selected file info */}
                    {selectedFile && (
                        <div className="file-info">
                            <p><strong>Selected:</strong> {selectedFile.name}</p>
                            <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                    )}

                    {/* Upload button */}
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || isLoading}
                        className={`button upload ${!selectedFile || isLoading ? 'disabled' : ''}`}
                    >
                        {isLoading ? 'Generating Code...' : 'Upload & Generate Code'}
                    </button>

                    {/* Download button */}
                    <button
                        onClick={downloadCode}
                        disabled={!generatedCode}
                        className={`button download ${!generatedCode ? 'disabled' : ''}`}
                    >
                        Download Code
                    </button>
                </div>

                {/* Right side - Generated code */}
                <div className="code-container">
                    <div className="code-header">
                        <h3>Generated React Code</h3>
                        <span>JSX</span>
                    </div>

                    <div className="code-content">
                        {isLoading ? (
                            <div className="loading">
                                <div className="spinner"></div>
                                <span>Generating code...</span>
                            </div>
                        ) : generatedCode ? (
                            <pre>{generatedCode}</pre>
                        ) : (
                            <div className="empty-state">
                                <svg
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                    />
                                </svg>
                                <p>Your React code will appear here</p>
                                <p>Select a file and click upload to generate code</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main App Component
function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <Router>
            <Routes>
                <Route 
                    path="/login" 
                    element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
                />
                <Route 
                    path="/signup" 
                    element={user ? <Navigate to="/" replace /> : <Signup onLogin={handleLogin} />} 
                />
                <Route 
                    path="/admin" 
                    element={
                        <AdminRoute user={user}>
                            <Admin />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/" 
                    element={
                        user ? (
                            <Dashboard user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
                {/* Catch all route - redirect to login if not authenticated */}
                <Route 
                    path="*" 
                    element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} 
                />
            </Routes>
        </Router>
    );
}

export default App;
