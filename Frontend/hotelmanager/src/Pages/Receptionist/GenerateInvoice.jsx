import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GenerateInvoice = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');

    const fetchReservations = async () => {
        try {
            const res = await fetch('https://localhost:7188/api/Reservation', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Erreur chargement');
            const data = await res.json();
            // only confirmed or checked‑in reservations
            const eligible = data.filter(r => r.statut === 0 || r.statut === 4);
            setReservations(eligible);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleGenerate = async () => {
        if (!selectedId) return;
        setLoading(true);
        try {
            const res = await fetch(`https://localhost:7188/api/Facture/reservation/${selectedId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess('Facture générée avec succès');
            setSelectedId('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Générer une facture</h2>
                    <p className="text-slate-500 text-sm">Choisissez une réservation confirmée ou en cours</p>
                </div>
                <Link to="/receptionist" className="...">← Retour</Link>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border-red-200 text-red-700 rounded-lg">⚠️ {error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border-green-200 text-green-700 rounded-lg">✅ {success}</div>}

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Réservation</label>
                    <select className="w-full border rounded-md p-2" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                        <option value="">-- Sélectionner --</option>
                        {reservations.map(r => (
                            <option key={r.id} value={r.id}>#{r.id} – Client {r.client?.nom} {r.client?.prenom}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={!selectedId || loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Génération...' : 'Générer la facture'}
                </button>
            </div>
        </div>
    );
};

export default GenerateInvoice;