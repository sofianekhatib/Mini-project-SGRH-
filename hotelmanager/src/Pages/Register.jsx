import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Client');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await fetch('https://localhost:7188/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                    role: role
                })
            });
            const textResponse = await response.text();
            if (!response.ok) {
                throw new Error(textResponse || "Erreur lors de l'inscription");
            }
            setSuccess('Inscription réussie ! Redirection vers la connexion...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Inscription</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nom d'utilisateur</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-md" value={username} onChange={e => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" className="w-full px-3 py-2 border rounded-md" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Mot de passe</label>
                        <input type="password" className="w-full px-3 py-2 border rounded-md" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Rôle</label>
                        <select className="w-full px-3 py-2 border rounded-md" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="Client">Client</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">S'inscrire</button>
                    <p className="text-center text-gray-600 text-sm mt-4">Déjà inscrit ? <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link></p>
                </form>
            </div>
        </div>
    );
};

export default Register;