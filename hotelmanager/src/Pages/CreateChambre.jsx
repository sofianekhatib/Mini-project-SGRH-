import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateChambre() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [numero, setNumero] = useState('');
    const [type, setType] = useState('');
    const [prixParNuit, setPrixParNuit] = useState('');
    const [statut, setStatut] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vous devez être connecté');
            return;
        }
        const price = parseFloat(prixParNuit);
        if (isNaN(price) || price <= 0) {
            setError('Le prix doit être un nombre positif');
            return;
        }
        const payload = {
            numero: numero,
            type: type,
            prixParNuit: price,
            statut: parseInt(statut, 10),
            description: description
        };

        try {
            const response = await fetch("https://localhost:7188/api/Chambre", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const textResponse = await response.text();
            if (!response.ok) {
                throw new Error(textResponse || "Erreur pendant l'ajout");
            }
            setSuccess("La chambre est ajoutée avec succès");
            setTimeout(() => navigate("/chambres"), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <span className="h-7 w-7 bg-indigo-50 rounded-md flex items-center justify-center text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </span>
                        Ajouter une chambre
                    </h2>
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 mt-2 text-sm">{error}</div>}
                    {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 mt-2 text-sm">{success}</div>}
                </div>

                <form className="p-5 space-y-3" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="numero" className="block text-xs font-medium text-slate-700 mb-1">Numéro</label>
                        <input onChange={e => setNumero(e.target.value)} value={numero} type="text" name="numero" id="numero" placeholder="ex: 101" required className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition" />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                        <select onChange={e => setType(e.target.value)} value={type} name="type" id="type" required className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition">
                            <option value="">-- Sélectionner --</option>
                            <option value="Standard">Standard</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Suite">Suite</option>
                            <option value="Double">Double</option>
                            <option value="Chambre avec Balcon">Chambre avec Balcon</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="prix" className="block text-xs font-medium text-slate-700 mb-1">Prix (€ / nuit)</label>
                        <input onChange={e => setPrixParNuit(e.target.value)} value={prixParNuit} type="number" step="0.01" name="prix" id="prix" placeholder="ex: 120" required className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition" />
                    </div>

                    <div>
                        <label htmlFor="statut" className="block text-xs font-medium text-slate-700 mb-1">Statut</label>
                        <select onChange={e => setStatut(e.target.value)} value={statut} name="statut" id="statut" required className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition">
                            <option value="">-- Sélectionner --</option>
                            <option value="0">Disponible</option>
                            <option value="1">Occupée</option>
                            <option value="2">En nettoyage</option>
                            <option value="3">Hors service</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="descr" className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                        <textarea onChange={e => setDescription(e.target.value)} value={description} name="descr" id="descr" rows="2" placeholder="Détails..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition" />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Link to="/chambres" className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer">Annuler</Link>
                        <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}