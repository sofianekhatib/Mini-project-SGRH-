import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function GestionUtilisateurs() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [formData, setFormData] = useState({
        nomUtilisateur: '',
        email: '',
        motDePasse: '',
        role: 'Receptionniste'
    });

    const token = localStorage.getItem('token');

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch('https://localhost:7188/api/AdminDashboard/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Erreur chargement utilisateurs');
            const data = await res.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            setError('No token found, please login');
            setLoading(false);
            return;
        }
        fetchUsers();
    }, [token, fetchUsers]);

    // Apply search and filter
    useEffect(() => {
        let result = [...users];

        // Search by username or email
        if (searchTerm.trim() !== '') {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.nomUtilisateur?.toLowerCase().includes(lowerSearch) ||
                u.email?.toLowerCase().includes(lowerSearch)
            );
        }

        // Filter by role
        if (roleFilter !== 'all') {
            result = result.filter(u => u.role === roleFilter);
        }

        setFilteredUsers(result);
    }, [users, searchTerm, roleFilter]);

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                nomUtilisateur: user.nomUtilisateur,
                email: user.email,
                motDePasse: '',
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

        if (!formData.nomUtilisateur || !formData.email) {
            setError('Username and email are required');
            return;
        }
        if (!editingUser && !formData.motDePasse) {
            setError('Password is required for new user');
            return;
        }

        try {
            let url = 'https://localhost:7188/api/AdminDashboard/users';
            let method = 'POST';
            let body = { ...formData };
            if (editingUser) {
                url += `/${editingUser.id}`;
                method = 'PUT';
                if (!body.motDePasse) delete body.motDePasse;
            } else {
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
            fetchUsers();
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

    const clearFilters = () => {
        setSearchTerm('');
        setRoleFilter('all');
        setShowFilterMenu(false);
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-slate-600">Chargement...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header with search, filter, and add button */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Gestion des utilisateurs</h2>
                    <p className="text-slate-500 text-sm">Créer, modifier ou supprimer des comptes</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 px-3 py-2 pl-8 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <svg className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    {/* Filter button with dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filtrer
                        </button>
                        {showFilterMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => { setRoleFilter('all'); setShowFilterMenu(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${roleFilter === 'all' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}
                                    >
                                        Tous les rôles
                                    </button>
                                    <button
                                        onClick={() => { setRoleFilter('Admin'); setShowFilterMenu(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${roleFilter === 'Admin' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}
                                    >
                                        Administrateurs
                                    </button>
                                    <button
                                        onClick={() => { setRoleFilter('Receptionniste'); setShowFilterMenu(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${roleFilter === 'Receptionniste' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}
                                    >
                                        Réceptionnistes
                                    </button>
                                    <hr className="my-1 border-slate-100" />
                                    <button
                                        onClick={clearFilters}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Effacer les filtres
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        + Nouvel utilisateur
                    </button>
                    <Link to="/admin" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm">
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
                        {filteredUsers.map((user) => (
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
                        {filteredUsers.length === 0 && (
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