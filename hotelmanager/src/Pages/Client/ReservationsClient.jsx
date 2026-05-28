import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ReservationsClient = () => {
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
        const statusMap = {
            0: { label: 'Confirmée', color: 'bg-green-100 text-green-700 border-green-200' },
            1: { label: 'Annulée', color: 'bg-red-100 text-red-700 border-red-200' },
            2: { label: 'Terminée', color: 'bg-gray-100 text-gray-700 border-gray-200' },
            3: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
        };
        return statusMap[statusCode] || { label: 'Inconnu', color: 'bg-gray-100 text-gray-700' };
    };

    const getClientIdFromToken = () => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.clientId || null;
        } catch {
            return null;
        }
    };

    const fetchReservations = async () => {
        setError('');
        setSuccess('');
        if (!token) {
            setError('Vous devez être connecté');
            setLoading(false);
            return;
        }
        const clientId = getClientIdFromToken();
        if (!clientId) {
            setError('Impossible d’identifier votre compte client. Veuillez vous reconnecter.');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`https://localhost:7188/api/Reservation/client/${clientId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            setReservations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const cancelReservation = async (id) => {
        if (!window.confirm('Annuler cette réservation ?')) return;
        try {
            const response = await fetch(`https://localhost:7188/api/Reservation/${id}/cancel`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Annulation échouée');
            }
            setSuccess('Réservation annulée avec succès');
            fetchReservations(); // refresh list
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Chargement de vos réservations...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Mes réservations</h2>
                    <p className="text-slate-500 text-sm">Consultez l’historique et le statut de vos réservations</p>
                </div>
                <Link to="/client" className="...">← Retour</Link>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">⚠️ {error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">✅ {success}</div>}

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                {reservations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Aucune réservation trouvée.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Chambre</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reservations.map((res) => {
                                    const status = getStatusInfo(res.statut);
                                    return (
                                        <tr key={res.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{res.id}</td>
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                Ch. {res.chambreNumero || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-700">
                                                {formatDate(res.dateDebut)} → {formatDate(res.dateFin)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {res.statut === 0 && (  // only "Confirmée" can be cancelled
                                                    <button
                                                        onClick={() => cancelReservation(res.id)}
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Annuler
                                                    </button>
                                                )}
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

export default ReservationsClient;