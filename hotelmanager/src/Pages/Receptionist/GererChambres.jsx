import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GererChambres = () => {
    const [chambres, setChambres] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [formData, setFormData] = useState({
        numero: '',
        type: '',
        prixParNuit: '',
        statut: '',
        description: ''
    });
    const token = localStorage.getItem('token');

    const fetchRooms = async () => {
        try {
            const res = await fetch('https://localhost:7188/api/Chambre', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Erreur chargement chambres');
            const data = await res.json();
            setChambres(data);
            setFilteredRooms(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // Apply search and filter
    useEffect(() => {
        let result = [...chambres];
        if (searchTerm.trim() !== '') {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(r =>
                r.numero?.toLowerCase().includes(lowerSearch) ||
                r.type?.toLowerCase().includes(lowerSearch)
            );
        }
        if (statusFilter !== 'all') {
            result = result.filter(r => r.statut === parseInt(statusFilter));
        }
        setFilteredRooms(result);
    }, [chambres, searchTerm, statusFilter]);

    const getStatusLabel = (statut) => {
        const map = {
            0: 'Disponible',
            1: 'Occupée',
            2: 'En nettoyage',
            3: 'Hors service'
        };
        return map[statut] || 'Inconnu';
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 0: return 'bg-green-100 text-green-700 border-green-200';
            case 1: return 'bg-red-100 text-red-700 border-red-200';
            case 2: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Open modal for adding
    const openAddModal = () => {
        setEditingRoom(null);
        setFormData({ numero: '', type: '', prixParNuit: '', statut: '', description: '' });
        setShowModal(true);
    };

    // Open modal for editing
    const openEditModal = (room) => {
        setEditingRoom(room);
        setFormData({
            numero: room.numero,
            type: room.type,
            prixParNuit: room.prixParNuit,
            statut: room.statut.toString(),
            description: room.description || ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRoom(null);
        setFormData({ numero: '', type: '', prixParNuit: '', statut: '', description: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Create or update room
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!formData.numero || !formData.type || !formData.prixParNuit || formData.statut === '') {
            setError('Tous les champs sont requis');
            return;
        }
        const price = parseFloat(formData.prixParNuit);
        if (isNaN(price) || price <= 0) {
            setError('Le prix doit être un nombre positif');
            return;
        }
        const payload = {
            numero: formData.numero,
            type: formData.type,
            prixParNuit: price,
            statut: parseInt(formData.statut, 10),
            description: formData.description
        };
        if (editingRoom) payload.id = editingRoom.id;
        try {
            const url = editingRoom
                ? `https://localhost:7188/api/Chambre/${editingRoom.id}`
                : 'https://localhost:7188/api/Chambre';
            const method = editingRoom ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || (editingRoom ? 'Update failed' : 'Creation failed'));
            }
            setSuccess(editingRoom ? 'Chambre mise à jour' : 'Chambre ajoutée');
            closeModal();
            fetchRooms();
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete room
    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer définitivement cette chambre ?')) return;
        try {
            const res = await fetch(`https://localhost:7188/api/Chambre/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Delete failed');
            }
            setSuccess('Chambre supprimée');
            fetchRooms();
        } catch (err) {
            setError(err.message);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setShowFilterMenu(false);
    };

    if (loading) return <div className="p-6 text-center">Chargement...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header with search, filter, add button, and back button */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Gestion des chambres</h2>
                    <p className="text-slate-500 text-sm">Ajouter, modifier ou supprimer des chambres</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher par numéro ou type"
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
                                    <button onClick={() => { setStatusFilter('all'); setShowFilterMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === 'all' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>
                                        Tous les statuts
                                    </button>
                                    <button onClick={() => { setStatusFilter('0'); setShowFilterMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === '0' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>
                                        Disponible
                                    </button>
                                    <button onClick={() => { setStatusFilter('1'); setShowFilterMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === '1' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>
                                        Occupée
                                    </button>
                                    <button onClick={() => { setStatusFilter('2'); setShowFilterMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === '2' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>
                                        En nettoyage
                                    </button>
                                    <button onClick={() => { setStatusFilter('3'); setShowFilterMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === '3' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>
                                        Hors service
                                    </button>
                                    <hr className="my-1 border-slate-100" />
                                    <button onClick={clearFilters} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                        Effacer les filtres
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Add button */}
                    <button
                        onClick={openAddModal}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        + Ajouter chambre
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Numéro</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Prix / nuit</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRooms.map(room => (
                                <tr key={room.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{room.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{room.numero}</td>
                                    <td className="px-6 py-4 text-slate-700">{room.type}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{room.prixParNuit} €</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.statut)}`}>
                                            {getStatusLabel(room.statut)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(room)}
                                                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room.id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRooms.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        Aucune chambre trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for adding/editing a room */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                            {editingRoom ? 'Modifier la chambre' : 'Ajouter une chambre'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    name="numero"
                                    placeholder="Numéro"
                                    value={formData.numero}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-md p-2 text-sm"
                                />
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-md p-2 text-sm"
                                >
                                    <option value="">-- Type --</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Deluxe">Deluxe</option>
                                    <option value="Suite">Suite</option>
                                    <option value="Double">Double</option>
                                    <option value="Chambre avec Balcon">Chambre avec Balcon</option>
                                </select>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="prixParNuit"
                                    placeholder="Prix par nuit"
                                    value={formData.prixParNuit}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-md p-2 text-sm"
                                />
                                <select
                                    name="statut"
                                    value={formData.statut}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-md p-2 text-sm"
                                >
                                    <option value="">-- Statut --</option>
                                    <option value="0">Disponible</option>
                                    <option value="1">Occupée</option>
                                    <option value="2">En nettoyage</option>
                                    <option value="3">Hors service</option>
                                </select>
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full border rounded-md p-2 text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                                    Annuler
                                </button>
                                <button type="submit" className="px-4 py-2 text-sm bg-slate-800 text-white rounded-md hover:bg-slate-700">
                                    {editingRoom ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GererChambres;