import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SystemConfiguration = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        hotelName: '',
        contactEmail: '',
        maintenanceMode: false
    });

    // In a real app, fetch settings from an API endpoint (protected by Admin role)
    useEffect(() => {
        // TODO: Replace with your actual API call
        setSettings({
            hotelName: 'HotelManager',
            contactEmail: 'contact@hotelmanager.com',
            maintenanceMode: false
        });
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Send updated settings to backend
        alert('Fonctionnalité à venir – sauvegarde des paramètres');
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Configuration système</h2>
                    <p className="text-slate-500 text-sm">Paramètres généraux de l’application</p>
                </div>
                <Link to="/admin" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm">
                    ← Retour
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l’hôtel</label>
                        <input
                            type="text"
                            name="hotelName"
                            value={settings.hotelName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email de contact</label>
                        <input
                            type="email"
                            name="contactEmail"
                            value={settings.contactEmail}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="maintenanceMode"
                            checked={settings.maintenanceMode}
                            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <label className="text-sm font-medium text-slate-700">Mode maintenance</label>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SystemConfiguration;