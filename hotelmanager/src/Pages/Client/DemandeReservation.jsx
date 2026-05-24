import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const DemandeReservation = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        chambreId: '',
        dateDebut: '',
        dateFin: ''
    });
    const token = localStorage.getItem('token');

    // Helper to extract clientId from JWT
    const getClientIdFromToken = () => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.clientId || payload.ClientId || null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const fetchRooms = async () => {
            if (!token) {
                setError('Vous devez être connecté');
                setLoading(false);
                return;
            }
            try {
                // Fetch all rooms (only those with statut "Disponible" could be filtered later)
                const res = await fetch('https://localhost:7188/api/Chambre', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Impossible de charger les chambres');
                const allRooms = await res.json();
                // Optional: filter only available rooms (statut === 0)
                const availableRooms = allRooms.filter(room => room.statut === 0);
                setRooms(availableRooms);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        const { chambreId, dateDebut, dateFin } = formData;
        if (!chambreId || !dateDebut || !dateFin) {
            setError('Tous les champs sont requis');
            setSubmitting(false);
            return;
        }
        if (new Date(dateDebut) >= new Date(dateFin)) {
            setError('La date de fin doit être après la date de début');
            setSubmitting(false);
            return;
        }

        const clientId = getClientIdFromToken();
        if (!clientId) {
            setError('Impossible d’identifier votre compte client. Reconnectez‑vous.');
            setSubmitting(false);
            return;
        }

        try {
            const payload = {
                clientId: parseInt(clientId),
                chambreId: parseInt(chambreId),
                dateDebut,
                dateFin
            };
            const res = await fetch('https://localhost:7188/api/Reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Demande échouée');
            }
            setSuccess('Réservation demandée avec succès ! Redirection...');
            setTimeout(() => navigate('/ReservationsClient'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Chargement des chambres...</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Nouvelle réservation</h2>
                    <p className="text-slate-500 text-sm">Choisissez vos dates et votre chambre</p>
                </div>
                <Link
                    to="/client"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                    ← Retour
                </Link>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">⚠️ {error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">✅ {success}</div>}

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Chambre</label>
                        <select
                            name="chambreId"
                            value={formData.chambreId}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                        >
                            <option value="">-- Sélectionner une chambre --</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    Chambre {room.numero} – {room.type} ({room.prixParNuit}€/nuit)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date d’arrivée</label>
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date de départ</label>
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
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50"
                        >
                            {submitting ? 'Envoi...' : 'Demander la réservation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DemandeReservation;