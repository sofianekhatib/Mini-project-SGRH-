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

    const getEmailFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.email || payload.Email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null;
        } catch {
            return null;
        }
    };

    const getClientIdByEmail = async (email) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://localhost:7188/api/Client/by-email/${email}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Client not found for this email');
        const client = await res.json();
        return client.id;
    };

    useEffect(() => {
        const fetchClientStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                let clientId = null;

                const payload = JSON.parse(atob(token.split('.')[1]));
                clientId = payload.clientId || payload.ClientId || null;

                if (!clientId) {
                    const email = getEmailFromToken();
                    if (!email) throw new Error('Email not found in token');
                    clientId = await getClientIdByEmail(email);
                }

                if (!clientId) throw new Error('clientId not found');

                const res = await fetch(`https://localhost:7188/api/Reservation/client/${clientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const reservations = await res.json();

                const active = reservations.filter(r => r.statut === 0 || r.statut === 3).length;
                const past = reservations.filter(r => r.statut === 2).length;

                setStats({
                    activeReservations: active,
                    pastReservations: past,
                    loyaltyPoints: 0,
                    notifications: 0
                });
            } catch (err) {
                console.error('Stats fetch error:', err);
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

    const menuItems = [
        { title: 'Mes réservations', description: 'Consultez et gérez vos réservations en cours', link: '/ReservationsClient', icon: Calendar },
        { title: 'Nouvelle réservation', description: 'Réservez une chambre selon vos dates', link: '/DemandeReservation', icon: Calendar },
        { title: 'Mes factures', description: 'Historique des paiements et factures', link: '/Factures', icon: CreditCard },
        { title: 'Mon profil', description: 'Modifiez vos informations personnelles', link: '/Profile', icon: Bell },
    ];

    if (loading) return <div className="flex justify-center items-center h-screen text-slate-600">Chargement...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Mon espace client</h1>
                            <p className="text-sm text-slate-500">Bonjour, <span className="font-medium">{user?.username}</span></p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition text-sm font-medium">
                            <LogOut size={18} /> Déconnexion
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

                {/* Functionality cards with "Accéder" buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
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

                <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-400">
                    © 2025 HotelManager – Tous droits réservés
                </footer>
            </main>
        </div>
    );
};

export default ClientDashboard;