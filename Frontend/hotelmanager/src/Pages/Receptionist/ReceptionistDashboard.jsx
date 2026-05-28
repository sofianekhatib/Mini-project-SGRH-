import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Users, Calendar, ClipboardCheck, ClipboardX, FileText, Hotel } from 'lucide-react';

const ReceptionistDashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ todayReservations: 0, occupiedRooms: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('https://localhost:7188/api/ReceptionistDashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const menuItems = [
        { title: 'Gestion des chambres', description: 'Voir et modifier le statut des chambres', icon: Hotel, link: '/GererChambres' },
        { title: 'Gestion des clients', description: 'Ajouter, modifier ou supprimer des clients', icon: Users, link: '/ClientManagement' },
        { title: 'Gestion des réservations', description: 'Voir toutes les réservations, annuler', icon: Calendar, link: '/ReceptionistReservations' },
        { title: 'Check‑in', description: 'Enregistrer l’arrivée d’un client', icon: ClipboardCheck, link: '/CheckIn' },
        { title: 'Check‑out', description: 'Enregistrer le départ et clôturer la facture', icon: ClipboardX, link: '/CheckOut' },
        { title: 'Générer facture', description: 'Créer une facture pour une réservation', icon: FileText, link: '/GenerateInvoice' }
    ];

    if (loading) return <div className="flex justify-center items-center h-screen text-slate-600">Chargement...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Espace Réceptionniste</h1>
                            <p className="text-sm text-slate-500">Bonjour, <span className="font-medium">{user?.username}</span></p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
                            <LogOut size={18} /> Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                        <p className="text-slate-500 text-sm uppercase tracking-wide">Réservations aujourd’hui</p>
                        <p className="text-3xl font-semibold text-slate-800 mt-1">{stats.todayReservations}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                        <p className="text-slate-500 text-sm uppercase tracking-wide">Chambres occupées</p>
                        <p className="text-3xl font-semibold text-slate-800 mt-1">{stats.occupiedRooms}</p>
                    </div>
                </div>

                {/* Functionality cards with "Accéder" button */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
                                <div className="p-5 flex flex-col h-full">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-slate-100 p-2 rounded-md text-slate-600">
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-slate-800">{item.title}</h3>
                                            <p className="text-slate-500 text-sm mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="mt-auto flex justify-end">
                                        <Link
                                            to={item.link}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                                        >
                                            Accéder
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default ReceptionistDashboard;