import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Factures = () => {
    const [factures, setFactures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    useEffect(() => {
        const getClientIdFromToken = () => {
            if (!token) return null;
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.clientId || null;
            } catch {
                return null;
            }
        };

        const fetchFactures = async () => {
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
                // First try the dedicated endpoint (if it exists)
                let response = await fetch(`https://localhost:7188/api/Facture/client/${clientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) {
                    // Fallback: fetch all factures and filter client-side using reservation.clientId
                    const allResponse = await fetch('https://localhost:7188/api/Facture', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (!allResponse.ok) throw new Error('Impossible de charger les factures');
                    const allFactures = await allResponse.json();
                    // Filter where the associated reservation belongs to this client
                    const filtered = allFactures.filter(f => f.reservation?.clientId === clientId);
                    setFactures(filtered);
                } else {
                    const data = await response.json();
                    setFactures(data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFactures();
    }, [token]);

    if (loading) return <div className="p-8 text-center text-slate-500">Chargement de vos factures...</div>;
    if (error) return <div className="p-8 text-center text-red-600">⚠️ {error}</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Mes factures</h2>
                    <p className="text-slate-500 text-sm">Historique de vos paiements</p>
                </div>
                <Link
                    to="/client"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                    ← Retour
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                {factures.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Aucune facture trouvée.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Réservation</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Montant</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date émission</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {factures.map(f => (
                                    <tr key={f.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{f.id}</td>
                                        <td className="px-6 py-4 text-slate-700">{f.reservationId || '—'}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{formatCurrency(f.montantTotal)}</td>
                                        <td className="px-6 py-4 text-slate-600">{formatDate(f.dateEmission)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${f.estPayee
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {f.estPayee ? 'Payée' : 'En attente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Factures;