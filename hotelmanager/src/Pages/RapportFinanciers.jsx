import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function RapportsFinanciers() {
    const [factures, setFactures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [payingId, setPayingId] = useState(null);

    const token = localStorage.getItem('token');

    const fetchFactures = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('https://localhost:7188/api/Facture', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch invoices');
            const data = await res.json();
            setFactures(data);
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
        fetchFactures();
    }, []);

    const handlePay = async (id) => {
        if (!window.confirm('Marquer cette facture comme payée ?')) return;
        setPayingId(id);
        setError('');
        setSuccess('');
        try {
            const res = await fetch(`https://localhost:7188/api/Facture/${id}/pay`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                // If your endpoint requires a body, add it here
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess('Facture marquée comme payée');
            fetchFactures(); // refresh list
        } catch (err) {
            setError(err.message);
        } finally {
            setPayingId(null);
        }
    };

    // Calculations
    const totalBilled = factures.reduce((sum, f) => sum + (f.montantTotal || 0), 0);
    const totalPaid = factures.reduce((sum, f) => sum + (f.estPayee ? (f.montantTotal || 0) : 0), 0);
    const totalPending = totalBilled - totalPaid;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Rapports financiers</h2>
                    <p className="text-slate-500 text-sm">Gestion des factures et paiements</p>
                </div>
                <Link
                    to="/AdminDashboard"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                    ← Retour
                </Link>
            </div>

            {/* Error / Success */}
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

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                    <p className="text-slate-500 text-sm uppercase tracking-wide">Total facturé</p>
                    <p className="text-2xl font-semibold text-slate-800 mt-1">{formatCurrency(totalBilled)}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                    <p className="text-slate-500 text-sm uppercase tracking-wide">Total payé</p>
                    <p className="text-2xl font-semibold text-green-700 mt-1">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                    <p className="text-slate-500 text-sm uppercase tracking-wide">Total impayé</p>
                    <p className="text-2xl font-semibold text-red-600 mt-1">{formatCurrency(totalPending)}</p>
                </div>
            </div>

            {/* Factures table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Chargement des factures...</div>
                ) : factures.length === 0 ? (
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
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {factures.map((facture) => (
                                    <tr key={facture.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{facture.id}</td>
                                        <td className="px-6 py-4 text-slate-700">{facture.reservationId || facture.reservation?.id || '-'}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{formatCurrency(facture.montantTotal)}</td>
                                        <td className="px-6 py-4 text-slate-600">{formatDate(facture.dateEmission)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${facture.estPayee
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {facture.estPayee ? 'Payée' : 'Impayée'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {!facture.estPayee && (
                                                <button
                                                    onClick={() => handlePay(facture.id)}
                                                    disabled={payingId === facture.id}
                                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
                                                >
                                                    {payingId === facture.id ? 'Patientez...' : 'Payer'}
                                                </button>
                                            )}
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
}