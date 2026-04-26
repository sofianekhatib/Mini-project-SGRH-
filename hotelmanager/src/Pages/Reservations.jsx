import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function GestionReservations() {
    const [reservations, setReservations] = useState([]);
    const [clients, setClients] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        clientId: '',
        chambreId: '',
        dateDebut: '',
        dateFin: ''
    });

    const token = localStorage.getItem('token');

    // Helper: format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Map status
    const getStatusInfo = (statusCode) => {
        const statusMap = {
            0: { label: 'Confirmée', color: 'bg-green-100 text-green-700 border-green-200' },
            1: { label: 'Annulée', color: 'bg-red-100 text-red-700 border-red-200' },
            2: { label: 'Terminée', color: 'bg-gray-100 text-gray-700 border-gray-200' },
            3: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
        };
        return statusMap[statusCode] || { label: 'Inconnu', color: 'bg-gray-100 text-gray-700' };
    };

    // Fetch all data
    const fetchAllData = async () => {
        setError('');
        setLoading(true);
        if (!token) {
            setError('No token found, please login');
            setLoading(false);
            return;
        }
        try {
            const [reservationsRes, clientsRes, roomsRes] = await Promise.all([
                fetch('https://localhost:7188/api/Reservation', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('https://localhost:7188/api/Client', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('https://localhost:7188/api/Chambre', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (!reservationsRes.ok) throw new Error('Failed to fetch reservations');
            if (!clientsRes.ok) throw new Error('Failed to fetch clients');
            if (!roomsRes.ok) throw new Error('Failed to fetch rooms');
            setReservations(await reservationsRes.json());
            setClients(await clientsRes.json());
            setRooms(await roomsRes.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Cancel reservation
    const cancelReservation = async (id) => {
        if (!window.confirm('Annuler cette réservation ?')) return;
        try {
            const res = await fetch(`https://localhost:7188/api/Reservation/${id}/cancel`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess('Réservation annulée');
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete reservation
    const deleteReservation = async (id) => {
        if (!window.confirm('Supprimer définitivement cette réservation ?')) return;
        try {
            const res = await fetch(`https://localhost:7188/api/Reservation/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess('Réservation supprimée');
            fetchAllData();
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle modal form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        if (!formData.clientId || !formData.chambreId || !formData.dateDebut || !formData.dateFin) {
            setError('Tous les champs sont requis');
            setSubmitting(false);
            return;
        }
        const start = new Date(formData.dateDebut);
        const end = new Date(formData.dateFin);
        if (start >= end) {
            setError('La date de fin doit être après la date de début');
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch('https://localhost:7188/api/Reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    clientId: parseInt(formData.clientId),
                    chambreId: parseInt(formData.chambreId),
                    dateDebut: formData.dateDebut,
                    dateFin: formData.dateFin
                })
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess('Réservation créée avec succès');
            setShowModal(false);
            setFormData({ clientId: '', chambreId: '', dateDebut: '', dateFin: '' });
            fetchAllData();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Gestion des réservations</h2>
                    <p className="text-slate-500 text-sm">Consultez, annulez ou créez des réservations</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        + Nouvelle réservation
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
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Chargement...</div>
                ) : reservations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Aucune réservation trouvée.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Début</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fin</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Réservée le</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Chambre</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reservations.map((item) => {
                                    const status = getStatusInfo(item.statut);
                                    const client = clients.find(c => c.id === item.clientId);
                                    const room = rooms.find(r => r.id === item.chambreId);
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.id}</td>
                                            <td className="px-6 py-4 text-slate-700">{formatDate(item.dateDebut)}</td>
                                            <td className="px-6 py-4 text-slate-700">{formatDate(item.dateFin)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{formatDate(item.dateReservation)}</td>
                                            <td className="px-6 py-4 text-slate-800">
                                                {client ? `${client.prenom} ${client.nom}` : item.clientId}
                                            </td>
                                            <td className="px-6 py-4 text-slate-800">
                                                {room ? `Ch. ${room.numero} (${room.type})` : item.chambreId}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {item.statut === 0 && (
                                                        <button
                                                            onClick={() => cancelReservation(item.id)}
                                                            className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                                                        >
                                                            Annuler
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteReservation(item.id)}
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de création */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Nouvelle réservation</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                                    <select
                                        name="clientId"
                                        value={formData.clientId}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                                    >
                                        <option value="">-- Sélectionner --</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.prenom} {c.nom} ({c.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Chambre</label>
                                    <select
                                        name="chambreId"
                                        value={formData.chambreId}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                                    >
                                        <option value="">-- Sélectionner --</option>
                                        {rooms.map(r => (
                                            <option key={r.id} value={r.id}>
                                                Ch. {r.numero} - {r.type} ({r.prixParNuit}€/nuit)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date début</label>
                                    <input
                                        type="date"
                                        name="dateDebut"
                                        value={formData.dateDebut}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date fin</label>
                                    <input
                                        type="date"
                                        name="dateFin"
                                        value={formData.dateFin}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm font-medium bg-slate-800 text-white rounded-md hover:bg-slate-700 transition disabled:opacity-50"
                                >
                                    {submitting ? 'Création...' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}