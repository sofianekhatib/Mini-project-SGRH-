import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Chambres() {
    var [chambres, setChambres] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please login');
            return;
        }

        fetch("https://localhost:7188/api/Chambre", {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => setChambres(data))
            .catch(err => console.log(err));
    }, []);

    const deleteRoom = async (roomId) => {
        const token = localStorage.getItem('token');
        setError('');
        setSuccess('');
        try {
            const response = await fetch(`https://localhost:7188/api/Chambre/${roomId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setSuccess(`Chambre ${roomId} supprimée avec succès`);
                setChambres(prev => prev.filter(room => room.id !== roomId));
                setTimeout(() => setSuccess(''), 3000);
            } else if (response.status === 400) {
                const errorText = await response.text();
                setError(errorText || "Impossible de supprimer cette chambre (réservations existantes)");
            } else if (response.status === 401) {
                setError("Session expirée, veuillez vous reconnecter");
            } else if (response.status === 404) {
                setError("Chambre non trouvée");
            } else {
                setError(`Erreur ${response.status}: impossible de supprimer`);
            }
        } catch (err) {
            setError("Erreur réseau: " + err.message);
        }
    };

    const updateRoom = async (roomId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Vous devez être connecté");
            return;
        }

        const roomToUpdate = chambres.find(room => room.id === roomId);
        if (!roomToUpdate) {
            setError("Chambre introuvable");
            return;
        }

        const newNumero = prompt("Nouveau numéro de chambre :", roomToUpdate.numero);
        if (newNumero === null) return;

        const newType = prompt("Nouveau type (Simple, Double, Suite) :", roomToUpdate.type);
        if (newType === null) return;

        const newPrix = prompt("Nouveau prix par nuit :", roomToUpdate.prixParNuit);
        if (newPrix === null) return;
        const prixParNuit = parseFloat(newPrix);
        if (isNaN(prixParNuit)) {
            setError("Le prix doit être un nombre valide");
            return;
        }

        const newStatut = prompt("Nouveau statut (0=Disponible, 1=Occupee, 2=EnNettoyage, 3=HorsService) :", roomToUpdate.statut);
        if (newStatut === null) return;
        const statut = parseInt(newStatut, 10);
        if (isNaN(statut) || statut < 0 || statut > 3) {
            setError("Statut invalide (0-3)");
            return;
        }

        const newDescription = prompt("Nouvelle description :", roomToUpdate.description);
        if (newDescription === null) return;

        const updatedRoom = {
            id: roomId,
            numero: newNumero,
            type: newType,
            prixParNuit: prixParNuit,
            statut: statut,
            description: newDescription
        };

        try {
            const response = await fetch(`https://localhost:7188/api/Chambre/${roomId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedRoom)
            });

            if (response.ok) {
                setSuccess(`Chambre ${roomId} mise à jour avec succès`);
                setChambres(prev =>
                    prev.map(room => room.id === roomId ? updatedRoom : room)
                );
                setTimeout(() => setSuccess(''), 3000);
            } else if (response.status === 400) {
                const errorText = await response.text();
                setError(errorText || "Données invalides");
            } else if (response.status === 401) {
                setError("Session expirée, reconnectez-vous");
            } else if (response.status === 404) {
                setError("Chambre non trouvée");
            } else {
                setError(`Erreur ${response.status}: mise à jour impossible`);
            }
        } catch (err) {
            setError("Erreur réseau: " + err.message);
        }
    };
    return (
        <div className="p-6 max-w-7xl mx-auto relative">
            {/* Sticky header section */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm -mx-6 px-6 py-2 shadow-sm mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 4h20" /><path d="M2 12h20" /><path d="M2 20h20" /><path d="M6 4v16" /><path d="M18 4v16" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-800">Chambres</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/CreateChambre"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition border border-indigo-600 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Ajouter Chambre
                        </Link>

                        <Link
                            to="/AdminDashboard"
                            className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm"
                        >
                            ← Retour
                        </Link>
                    </div>
                </div>
            </div>

            {/* Error / success messages */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    ⚠️ {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    ✅ {success}
                </div>
            )}

            {/* Table container */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50/90 border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">ID</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Numéro</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Prix / Nuit</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Statut</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {chambres.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                <td className="px-5 py-4 font-mono text-xs text-slate-500">{item.id}</td>
                                <td className="px-5 py-4 font-medium text-slate-800">{item.numero}</td>
                                <td className="px-5 py-4 text-slate-700">{item.type}</td>
                                <td className="px-5 py-4 font-medium text-slate-800">{item.prixParNuit}</td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        {item.statut}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-slate-600">{item.description}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateRoom(item.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium rounded-lg border border-amber-200 shadow-sm transition cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                                            </svg>
                                            Update
                                        </button>
                                        <button onClick={() => deleteRoom(item.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium rounded-lg border border-rose-200 shadow-sm transition cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                <path d="M8 4V2h8v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}