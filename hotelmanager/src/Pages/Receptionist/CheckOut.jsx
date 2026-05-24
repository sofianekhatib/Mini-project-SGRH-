import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CheckOut = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');

    const fetchActive = async () => {
        try {
            const res = await fetch('https://localhost:7188/api/Reservation/active', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Erreur chargement');
            const data = await res.json();
            setReservations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActive();
    }, []);

    const handleCheckOut = async (id) => {
        if (!window.confirm('Finaliser le check‑out ? La facture sera générée.')) return;
        try {
            const res = await fetch(`https://localhost:7188/api/Reservation/${id}/checkout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
            setSuccess('Check‑out effectué, facture générée');
            fetchActive();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="p-6 text-center">Chargement...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Check‑out</h2>
                    <p className="text-slate-500 text-sm">Séjours en cours</p>
                </div>
                <Link to="/receptionist" className="...">← Retour</Link>
            </div>
            {error && <div className="mb-4 p-3 bg-red-50 border-red-200 text-red-700 rounded-lg">⚠️ {error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border-green-200 text-green-700 rounded-lg">✅ {success}</div>}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left">Client</th>
                            <th className="px-6 py-3 text-left">Chambre</th>
                            <th className="px-6 py-3 text-left">Dates</th>
                            <th className="px-6 py-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map(res => (
                            <tr key={res.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">{res.client.prenom} {res.client.nom}</td>
                                <td className="px-6 py-4">Ch. {res.chambre.numero} – {res.chambre.type}</td>
                                <td className="px-6 py-4">{new Date(res.dateDebut).toLocaleDateString()} → {new Date(res.dateFin).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleCheckOut(res.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Check‑out</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CheckOut;