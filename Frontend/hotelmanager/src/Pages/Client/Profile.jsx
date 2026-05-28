import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: ''
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setError('Vous devez être connecté');
            setLoading(false);
            return;
        }

        fetch('https://localhost:7188/api/Client/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Impossible de récupérer vos informations');
                return res.json();
            })
            .then(data => {
                setClient(data);
                setForm({
                    nom: data.nom || '',
                    prenom: data.prenom || '',
                    email: data.email || '',
                    telephone: data.telephone || '',
                    adresse: data.adresse || ''
                });
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setForm({
            nom: client.nom || '',
            prenom: client.prenom || '',
            email: client.email || '',
            telephone: client.telephone || '',
            adresse: client.adresse || ''
        });
        setEditing(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            // Send PUT request to update client using their ID
            const response = await fetch(`https://localhost:7188/api/Client/${client.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: client.id,
                    nom: form.nom,
                    prenom: form.prenom,
                    email: form.email,
                    telephone: form.telephone,
                    adresse: form.adresse
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Erreur lors de la modification');
            }

            // Refresh client data after update
            const updated = await fetch('https://localhost:7188/api/Client/me', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json());

            setClient(updated);
            setForm({
                nom: updated.nom || '',
                prenom: updated.prenom || '',
                email: updated.email || '',
                telephone: updated.telephone || '',
                adresse: updated.adresse || ''
            });
            setEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Chargement de votre profil...</div>;
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                ⚠️ {error}
                <div className="mt-4">
                    <Link to="/client" className="text-indigo-600 hover:underline">← Retour au tableau de bord</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Mon profil</h2>
                    <p className="text-slate-500 text-sm">Consultez et gérez vos informations personnelles</p>
                </div>
                <Link
                    to="/client"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                    ← Retour
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-medium text-slate-800">Informations personnelles</h3>
                </div>
                <div className="p-6 space-y-4">
                    {editing ? (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600">Nom</label>
                                    <input
                                        type="text"
                                        name="nom"
                                        value={form.nom}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600">Prénom</label>
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={form.prenom}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600">Téléphone</label>
                                    <input
                                        type="text"
                                        name="telephone"
                                        value={form.telephone}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-600">Adresse</label>
                                    <input
                                        type="text"
                                        name="adresse"
                                        value={form.adresse}
                                        onChange={handleChange}
                                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                                    {error}
                                </div>
                            )}
                            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
                                >
                                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600">Nom</label>
                                    <p className="mt-1 text-slate-800">{client.nom || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600">Prénom</label>
                                    <p className="mt-1 text-slate-800">{client.prenom || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600">Email</label>
                                    <p className="mt-1 text-slate-800">{client.email || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600">Téléphone</label>
                                    <p className="mt-1 text-slate-800">{client.telephone || '-'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-600">Adresse</label>
                                    <p className="mt-1 text-slate-800">{client.adresse || '-'}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-200 text-right">
                                <button
                                    onClick={handleEdit}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
                                >
                                    Modifier
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;