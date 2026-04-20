// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Appel à l'endpoint login (pas register)
            const response = await fetch('https://localhost:7188/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nomUtilisateur: username,   // adaptez si votre LoginDto utilise Username
                    motDePasse: password
                })
            });

            if (!response.ok) {
                throw new Error('Nom d’utilisateur ou mot de passe incorrect');
            }

            const data = await response.json();
            const token = data.token;

            // Décoder le token pour obtenir le rôle
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload.role; // ou payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]

            onLogin(token, role);
            if (role === 'Admin') navigate('/admin');
            else navigate('/client');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nom d'utilisateur</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Mot de passe</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                        Se connecter
                    </button>
                    <p className="text-center text-gray-600 text-sm mt-4">
                        Pas encore de compte ? <Link to="/register" className="text-blue-600 hover:underline">S'inscrire</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;