import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Calendar, Home, CreditCard, Bell } from 'lucide-react';

const ClientDashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeReservations: 0,
        pastReservations: 0,
        loyaltyPoints: 0,
        notifications: 0
    });
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    useEffect(() => {
        // Simulate fetching client stats (replace with real API call)
        const fetchClientStats = async () => {
            try {
                const token = localStorage.getItem('token');
                // Replace with your actual endpoint
                const res = await fetch('https://localhost:7188/api/ClientDashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    // Fallback mock data for demo
                    setStats({ activeReservations: 2, pastReservations: 3, loyaltyPoints: 850, notifications: 1 });
                }
            } catch (err) {
                setStats({ activeReservations: 2, pastReservations: 3, loyaltyPoints: 850, notifications: 1 });
            } finally {
                setLoading(false);
            }
        };
        fetchClientStats();
    }, []);

    const statCards = [
        { label: 'Réservations actives', value: stats.activeReservations, icon: Calendar },
        { label: 'Séjours passés', value: stats.pastReservations, icon: Home },
        { label: 'Points fidélité', value: stats.loyaltyPoints, icon: CreditCard },
        { label: 'Notifications', value: stats.notifications, icon: Bell },
    ];

    if (loading) return <div className="flex justify-center items-center h-screen text-slate-600">Chargement...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Mon espace client</h1>
                            <p className="text-sm text-slate-500">
                                Bonjour, <span className="font-medium text-slate-700">{user?.username}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition text-sm font-medium"
                        >
                            <LogOut size={18} />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    {statCards.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm uppercase tracking-wide">{stat.label}</p>
                                        <p className="text-2xl font-semibold text-slate-800 mt-1">{stat.value}</p>
                                    </div>
                                    <div className="bg-slate-100 p-2 rounded-full text-slate-600">
                                        <Icon size={22} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: 'Mes réservations', description: 'Consultez et gérez vos réservations en cours', link: '/mes-reservations', icon: Calendar },
                        { title: 'Nouvelle réservation', description: 'Réservez une chambre selon vos dates', link: '/nouvelle-reservation', icon: Calendar },
                        { title: 'Mes factures', description: 'Historique des paiements et factures', link: '/mes-factures', icon: CreditCard },
                        { title: 'Mon profil', description: 'Modifiez vos informations personnelles', link: '/mon-profil', icon: Bell },
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="group bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-slate-100 p-2 rounded-md text-slate-600 group-hover:bg-slate-200 transition">
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-slate-800">{item.title}</h3>
                                            <p className="text-slate-500 text-sm mt-1">{item.description}</p>
                                            <Link to={item.link} className="inline-flex items-center text-slate-600 hover:text-slate-900 text-sm font-medium mt-3 group-hover:underline">
                                                Accéder
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-400">
                    © 2025 HotelManager – Tous droits réservés
                </footer>
            </main>
        </div>
    );
};

export default ClientDashboard;