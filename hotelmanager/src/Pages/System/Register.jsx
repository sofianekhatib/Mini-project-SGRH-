import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    // Role is now fixed to 'Client' (no dropdown needed)
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [adresse, setAdresse] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation for client fields
        if (!nom.trim()) { setError('Le nom est requis'); return; }
        if (!prenom.trim()) { setError('Le prénom est requis'); return; }
        if (!telephone.trim()) { setError('Le téléphone est requis'); return; }
        if (!adresse.trim()) { setError('L’adresse est requise'); return; }

        try {
            const response = await fetch('https://localhost:7188/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    role: 'Client',   // fixed
                    nom,
                    prenom,
                    telephone,
                    adresse
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Inscription Client</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-1">Nom d'utilisateur</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-md" value={username} onChange={e => setUsername(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
                            <input type="email" className="w-full px-3 py-2 border rounded-md" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Mot de passe</label>
                            <input type="password" className="w-full px-3 py-2 border rounded-md" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Nom</label>
                            <input type="text" className="w-full px-3 py-2 border rounded-md" value={nom} onChange={e => setNom(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Prénom</label>
                            <input type="text" className="w-full px-3 py-2 border rounded-md" value={prenom} onChange={e => setPrenom(e.target.value)} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Téléphone</label>
                            <input type="tel" className="w-full px-3 py-2 border rounded-md" value={telephone} onChange={e => setTelephone(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Adresse</label>
                            <input type="text" className="w-full px-3 py-2 border rounded-md" value={adresse} onChange={e => setAdresse(e.target.value)} required />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition mt-2">S'inscrire</button>
                    <p className="text-center text-gray-600 text-sm mt-4">Déjà inscrit ? <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link></p>
                </form>
            </div>
        </div>
    );
};

export default Register;