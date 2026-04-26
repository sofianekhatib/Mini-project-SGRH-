import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function GestionChambres() {
    const [chambres, setChambres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        numero: '',
        type: '',
        prixParNuit: '',
        statut: '',
        description: ''
    });

    const token = localStorage.getItem('token');

    // Fetch rooms
    const fetchRooms = async () => {
        setLoading(true);
        setError('');
        if (!token) {
            setError('No token found, please login');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('https://localhost:7188/api/Chambre', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setChambres(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // Open modal for new or edit
    const openModal = (room = null) => {
        if (room) {
            setEditingRoom(room);
            setFormData({
                numero: room.numero,
                type: room.type,
                prixParNuit: room.prixParNuit,
                statut: room.statut.toString(),
                description: room.description || ''
            });
        } else {
            setEditingRoom(null);
            setFormData({ numero: '', type: '', prixParNuit: '', statut: '', description: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRoom(null);
        setFormData({ numero: '', type: '', prixParNuit: '', statut: '', description: '' });
    };

    // Handle form input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        // Validation
        if (!formData.numero || !formData.type || !formData.prixParNuit || formData.statut === '') {
            setError('Tous les champs sont requis');
            setSubmitting(false);
            return;
        }
        const price = parseFloat(formData.prixParNuit);
        if (isNaN(price) || price <= 0) {
            setError('Le prix doit être un nombre positif');
            setSubmitting(false);
            return;
        }
        const payload = {
            numero: formData.numero,
            type: formData.type,
            prixParNuit: price,
            statut: parseInt(formData.statut, 10),
            description: formData.description
        };

        try {
            let url = 'https://localhost:7188/api/Chambre';
            let method = 'POST';
            if (editingRoom) {
                url += `/${editingRoom.id}`;
                method = 'PUT';
                payload.id = editingRoom.id;
            }

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
            fetchRooms(); // refresh list
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete room
    const deleteRoom = async (id) => {
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

    // Map status code to label
    const getStatusLabel = (code) => {
        const map = {
            0: 'Disponible',
            1: 'Occupée',
            2: 'En nettoyage',
            3: 'Hors service'
        };
        return map[code] || 'Inconnu';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Gestion des chambres</h2>
                    <p className="text-slate-500 text-sm">Ajoutez, modifiez ou supprimez les chambres</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => openModal()}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        + Nouvelle chambre
                    </button>
                    <Link
                        to="/AdminDashboard"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
                    >
                        ← Retour
                    </Link>
                </div>
            </div>

            {/* Messages */}
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

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Chargement...</div>
                ) : chambres.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Aucune chambre trouvée.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Numéro</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Prix / nuit</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {chambres.map((room) => (
                                    <tr key={room.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{room.id}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{room.numero}</td>
                                        <td className="px-6 py-4 text-slate-700">{room.type}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{room.prixParNuit} €</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium border bg-slate-100 text-slate-700 border-slate-200">
                                                {getStatusLabel(room.statut)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{room.description || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openModal(room)}
                                                    className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => deleteRoom(room.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal (Add / Edit) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                            {editingRoom ? 'Modifier la chambre' : 'Ajouter une chambre'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Numéro</label>
                                    <input
                                        type="text"
                                        name="numero"
                                        value={formData.numero}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">-- Sélectionner --</option>
                                        <option value="Standard">Standard</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="Suite">Suite</option>
                                        <option value="Double">Double</option>
                                        <option value="Chambre avec Balcon">Chambre avec Balcon</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Prix par nuit (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="prixParNuit"
                                        value={formData.prixParNuit}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                                    <select
                                        name="statut"
                                        value={formData.statut}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">-- Sélectionner --</option>
                                        <option value="0">Disponible</option>
                                        <option value="1">Occupée</option>
                                        <option value="2">En nettoyage</option>
                                        <option value="3">Hors service</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows="2"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm resize-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm font-medium bg-slate-800 text-white rounded-md hover:bg-slate-700 transition disabled:opacity-50"
                                >
                                    {submitting ? 'Enregistrement...' : (editingRoom ? 'Mettre à jour' : 'Créer')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}