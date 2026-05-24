import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const GestionReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusInfo = (statusCode) => {
        const map = {
            0: { label: 'Confirmée', color: 'bg-green-100 text-green-700 border-green-200' },
            1: { label: 'Annulée', color: 'bg-red-100 text-red-700 border-red-200' },
            2: { label: 'Terminée', color: 'bg-gray-100 text-gray-700 border-gray-200' },
            3: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
        };
        return map[statusCode] || { label: 'Inconnu', color: 'bg-gray-100 text-gray-700' };
    };

    const fetchReservations = useCallback(async () => {
        setLoading(true);
        setError('');
        if (!token) {
            setError('Vous devez être connecté');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('https://localhost:7188/api/Reservation', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setReservations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const cancelReservation = async (id) => {
        if (!window.confirm('Annuler cette réservation ?')) return;
        try {
            const res = await fetch(`https://localhost:7188/api/Reservation/${id}/cancel`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess('Réservation annulée');
            fetchReservations();
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteReservation = async (id) => {
        if (!window.confirm('Supprimer définitivement cette réservation ?')) return;
        try {
            const res = await fetch(`https://localhost:7188/api/Reservation/${id}/cancel`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess('Réservation supprimée');
            fetchReservations();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Chargement des réservations...</div>;
    if (error) return <div className="p-8 text-center text-red-600">⚠️ {error}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Gestion des réservations</h2>
                    <p className="text-slate-500 text-sm">Consultez, annulez ou supprimez toutes les réservations</p>
                </div>
                <Link to="/admin" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm">
                    ← Retour
                </Link>
            </div>

            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>}

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                {reservations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Aucune réservation trouvée.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Chambre</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Réservée le</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reservations.map((res) => {
                                    const status = getStatusInfo(res.statut);
                                    return (
                                        <tr key={res.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{res.id}</td>
                                            <td className="px-6 py-4 text-slate-800">
                                                {res.clientNomComplet}
                                            </td>
                                            <td className="px-6 py-4 text-slate-700">
                                                Ch. {res.chambreNumero}
                                            </td>
                                            <td className="px-6 py-4 text-slate-700">
                                                {formatDate(res.dateDebut)} → {formatDate(res.dateFin)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{formatDate(res.dateReservation)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {res.statut === 0 && (
                                                        <button onClick={() => cancelReservation(res.id)} className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                                                            Annuler
                                                        </button>
                                                    )}
                                                    <button onClick={() => deleteReservation(res.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
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
        </div>
    );
};

export default GestionReservations;