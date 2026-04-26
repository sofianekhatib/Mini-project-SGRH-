import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
export default function GestionUtilisateurs() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nomUtilisateur: '',
        email: '',
        motDePasse: '',
        role: 'Receptionniste'
    });

    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        try {
            const res = await fetch('https://localhost:7188/api/AdminDashboard/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            setError('No token found, please login');
            setLoading(false);
            return;
        }
        fetchUsers();
    }, [token]);

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                nomUtilisateur: user.nomUtilisateur,
                email: user.email,
                motDePasse: '', // empty for edit (optional)
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                nomUtilisateur: '',
                email: '',
                motDePasse: '',
                role: 'Receptionniste'
            });
        }
        setShowModal(true);
        setError('');
        setSuccess('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
            nomUtilisateur: '',
            email: '',
            motDePasse: '',
            role: 'Receptionniste'
        });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.nomUtilisateur || !formData.email) {
            setError('Username and email are required');
            return;
        }
        if (!editingUser && !formData.motDePasse) {
            setError('Password is required for new user');
            return;
        }

        try {
            let url = 'https://localhost:7188/api/Client';
            let method = 'POST';
            let body = { ...formData };
            if (editingUser) {
                url += `/${editingUser.id}`;
                method = 'PUT';
                // if password is empty, remove it from body
                if (!body.motDePasse) delete body.motDePasse;
            } else {
                // new user: password must be present
                if (!body.motDePasse) throw new Error('Password required');
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Operation failed');
            }
            setSuccess(editingUser ? 'User updated successfully' : 'User created successfully');
            handleCloseModal();
            fetchUsers(); // refresh list
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user permanently?')) return;
        try {
            const res = await fetch(`https://localhost:7188/api/AdminDashboard/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Delete failed');
            setSuccess('User deleted');
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-slate-600">Chargement...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Gestion des utilisateurs</h2>
                    <p className="text-slate-500 text-sm">Créer, modifier ou supprimer des comptes</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        + Nouvel utilisateur
                    </button>
                    <Link
                        to="/AdminDashboard"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
                    >
                        ← Retour
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    ⚠️ {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    ✅ {success}
                </div>
            )}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom d'utilisateur</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rôle</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 font-mono text-slate-500 text-xs">{user.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-800">{user.nomUtilisateur}</td>
                                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border
                                        ${user.role === 'Admin' ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(user)}
                                            className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal (Add/Edit) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                            {editingUser ? 'Modifier l’utilisateur' : 'Ajouter un utilisateur'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Nom d'utilisateur</label>
                                    <input
                                        type="text"
                                        name="nomUtilisateur"
                                        value={formData.nomUtilisateur}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Mot de passe {editingUser && <span className="text-xs text-slate-400">(laisser vide pour ne pas changer)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        name="motDePasse"
                                        value={formData.motDePasse}
                                        onChange={handleInputChange}
                                        required={!editingUser}
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Rôle</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="Receptionniste">Réceptionniste</option>
                                        <option value="Admin">Administrateur</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium bg-slate-800 text-white rounded-md hover:bg-slate-700 transition"
                                >
                                    {editingUser ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}