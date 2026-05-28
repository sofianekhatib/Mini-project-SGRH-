import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: ''
    });
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const token = localStorage.getItem('token');

    const fetchClients = async () => {
        try {
            const res = await fetch('https://localhost:7188/api/Client', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Erreur chargement clients');
            const data = await res.json();
            setClients(data);
            setFilteredClients(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchClients();
    }, []);

    // Apply search and filter whenever clients, searchTerm or filterOption changes
    useEffect(() => {
        let result = [...clients];

        // 1. Apply search (on nom or prenom)
        if (searchTerm.trim() !== '') {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(c =>
                c.nom?.toLowerCase().includes(lowerSearch) ||
                c.prenom?.toLowerCase().includes(lowerSearch)
            );
        }

        // 2. Apply filter option
        if (filterOption === 'hasPhone') {
            result = result.filter(c => c.telephone && c.telephone.trim() !== '');
        } else if (filterOption === 'noPhone') {
            result = result.filter(c => !c.telephone || c.telephone.trim() === '');
        } else if (filterOption === 'hasEmail') {
            result = result.filter(c => c.email && c.email.trim() !== '');
        }

        setFilteredClients(result);
    }, [clients, searchTerm, filterOption]);

    const openModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                nom: client.nom,
                prenom: client.prenom,
                email: client.email,
                telephone: client.telephone,
                adresse: client.adresse
            });
        } else {
            setEditingClient(null);
            setFormData({ nom: '', prenom: '', email: '', telephone: '', adresse: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingClient(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            let url = 'https://localhost:7188/api/Client';
            let method = 'POST';
            if (editingClient) {
                url += `/${editingClient.id}`;
                method = 'PUT';
                formData.id = editingClient.id;
            }
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess(editingClient ? 'Client modifié' : 'Client ajouté');
            closeModal();
            fetchClients();
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteClient = async (id) => {
        if (!window.confirm('Supprimer ce client ?')) return;
        try {
            const res = await fetch(`https://localhost:7188/api/Client/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess('Client supprimé');
            fetchClients();
        } catch (err) {
            setError(err.message);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterOption('all');
        setShowFilterMenu(false);
    };

    if (loading) return <div className="p-6 text-center">Chargement...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Gestion des clients</h2>
                    <p className="text-slate-500 text-sm">Ajouter, modifier ou supprimer des clients</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou prénom"
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
                                        onClick={() => { setFilterOption('all'); setShowFilterMenu(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filterOption === 'all' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}
                                    >
                                        Tous les clients
                                    </button>
                                    <button
                                        onClick={() => { setFilterOption('hasPhone'); setShowFilterMenu(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filterOption === 'hasPhone' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}
                                    >
                                        Avec numéro de téléphone
                                    </button>
                                    <button
                                        onClick={() => { setFilterOption('noPhone'); setShowFilterMenu(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filterOption === 'noPhone' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}
                                    >
                                        Sans numéro de téléphone
                                    </button>
                                    <button
                                        onClick={() => { setFilterOption('hasEmail'); setShowFilterMenu(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filterOption === 'hasEmail' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}
                                    >
                                        Avec email
                                    </button>
                                    <hr className="my-1 border-slate-100" />
                                    <button
                                        onClick={() => clearFilters()}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Effacer les filtres
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Add client button */}
                    <button
                        onClick={() => openModal()}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        + Nouveau client
                    </button>
                    <Link
                        to="/receptionist"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
                    >
                        ← Retour
                    </Link>
                </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">⚠️ {error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">✅ {success}</div>}

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Prénom</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Téléphone</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Adresse</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredClients.map(client => (
                                <tr key={client.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{client.id}</td>
                                    <td className="px-6 py-4 text-slate-800">{client.nom}</td>
                                    <td className="px-6 py-4 text-slate-800">{client.prenom}</td>
                                    <td className="px-6 py-4 text-slate-600">{client.email}</td>
                                    <td className="px-6 py-4 text-slate-600">{client.telephone || '—'}</td>
                                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{client.adresse || '—'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => openModal(client)} className="text-amber-600 hover:text-amber-800 text-sm font-medium">Modifier</button>
                                            <button onClick={() => deleteClient(client.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Supprimer</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                        Aucun client ne correspond à vos critères.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Add/Edit (unchanged) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">{editingClient ? 'Modifier client' : 'Ajouter client'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-3">
                                <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required className="w-full border rounded-md p-2 text-sm" />
                                <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required className="w-full border rounded-md p-2 text-sm" />
                                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border rounded-md p-2 text-sm" />
                                <input type="text" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} className="w-full border rounded-md p-2 text-sm" />
                                <textarea name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} rows="2" className="w-full border rounded-md p-2 text-sm" />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Annuler</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-slate-800 text-white rounded-md hover:bg-slate-700">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientManagement;