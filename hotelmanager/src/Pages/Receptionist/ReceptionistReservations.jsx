import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ReceptionistReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const token = localStorage.getItem('token');

    const formatDate = (date) => new Date(date).toLocaleString('fr-FR');

    const getStatusLabel = (status) => {
        const map = { 0: 'Confirmée', 1: 'Annulée', 2: 'Terminée', 3: 'En attente', 4: 'En cours' };
        return map[status] || 'Inconnu';
    };

    const fetchReservations = async () => {
        try {
            const res = await fetch('https://localhost:7188/api/Reservation', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Erreur chargement réservations');
            const data = await res.json();
            setReservations(data);
            setFilteredReservations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    // Apply search and filter
    useEffect(() => {
        let result = [...reservations];

        // 1. Search by client name or room number
        if (searchTerm.trim() !== '') {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(r =>
            (r.client?.nom?.toLowerCase().includes(lowerSearch) ||
                r.client?.prenom?.toLowerCase().includes(lowerSearch) ||
                r.chambre?.numero?.toLowerCase().includes(lowerSearch))
            );
        }

        // 2. Filter by status
        if (statusFilter !== 'all') {
            const statusNum = parseInt(statusFilter);
            result = result.filter(r => r.statut === statusNum);
        }

        setFilteredReservations(result);
    }, [reservations, searchTerm, statusFilter]);

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

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setShowFilterMenu(false);
    };

    if (loading) return <div className="p-6 text-center">Chargement...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Gestion des réservations</h2>
                    <p className="text-slate-500 text-sm">Consulter, annuler ou filtrer les réservations</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher par client ou chambre"
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
                                        Confirmée
                                    </button>
                                    <button onClick={() => { setStatusFilter('3'); setShowFilterMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === '3' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>
                                        En attente
                                    </button>
                                    <button onClick={() => { setStatusFilter('4'); setShowFilterMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === '4' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>
                                        En cours
                                    </button>
                                    <button onClick={() => { setStatusFilter('2'); setShowFilterMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === '2' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>
                                        Terminée
                                    </button>
                                    <button onClick={() => { setStatusFilter('1'); setShowFilterMenu(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${statusFilter === '1' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'}`}>
                                        Annulée
                                    </button>
                                    <hr className="my-1 border-slate-100" />
                                    <button onClick={() => clearFilters()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                        Effacer les filtres
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Chambre</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredReservations.map(res => (
                                <tr key={res.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-mono text-xs">{res.id}</td>
                                    <td className="px-6 py-4 text-slate-800">{res.client?.prenom} {res.client?.nom}</td>
                                    <td className="px-6 py-4 text-slate-700">Ch. {res.chambre?.numero} – {res.chambre?.type}</td>
                                    <td className="px-6 py-4 text-slate-700">{formatDate(res.dateDebut)} → {formatDate(res.dateFin)}</td>
                                    <td className="px-6 py-4">{getStatusLabel(res.statut)}</td>
                                    <td className="px-6 py-4">
                                        {res.statut === 0 && (
                                            <button onClick={() => cancelReservation(res.id)} className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                                                Annuler
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredReservations.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        Aucune réservation ne correspond aux critères.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistReservations;