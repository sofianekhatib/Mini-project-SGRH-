import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Hotel, Users, Calendar, TrendingUp, BarChart3, Settings } from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalChambres: 0,
        totalClients: 0,
        totalReservations: 0,
        totalRevenus: 0
    });
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    useEffect(() => {
        fetch('https://localhost:7188/api/AdminDashboard/stats/totals', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-slate-600">Chargement des statistiques...</div>;
    }

    const menuItems = [
        { title: 'Gestion des utilisateurs', description: 'Créer des réceptionnistes, gérer les droits', icon: Users, link: '/GestionUtilisateurs' },
        { title: 'Rapports financiers', description: 'Consulter les factures et paiements', icon: BarChart3, link: '/RapportsFinanciers' },
        { title: 'Configurer système', description: 'Paramètres généraux de l’application', icon: Settings, link: '/SystemConfiguration' }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Tableau de bord Admin</h1>
                            <p className="text-sm text-slate-500">Bonjour, <span className="font-medium">{user?.username}</span></p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition text-sm font-medium">
                            <LogOut size={18} /> Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm uppercase tracking-wide">Chambres totales</p>
                                <p className="text-3xl font-semibold text-slate-800 mt-1">{stats.totalChambres}</p>
                            </div>
                            <div className="bg-slate-100 p-2 rounded-full text-slate-600"><Hotel size={22} /></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm uppercase tracking-wide">Clients</p>
                                <p className="text-3xl font-semibold text-slate-800 mt-1">{stats.totalClients}</p>
                            </div>
                            <div className="bg-slate-100 p-2 rounded-full text-slate-600"><Users size={22} /></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm uppercase tracking-wide">Réservations</p>
                                <p className="text-3xl font-semibold text-slate-800 mt-1">{stats.totalReservations}</p>
                            </div>
                            <div className="bg-slate-100 p-2 rounded-full text-slate-600"><Calendar size={22} /></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm uppercase tracking-wide">Revenus (€)</p>
                                <p className="text-3xl font-semibold text-slate-800 mt-1">{stats.totalRevenus} €</p>
                            </div>
                            <div className="bg-slate-100 p-2 rounded-full text-slate-600"><TrendingUp size={22} /></div>
                        </div>
                    </div>
                </div>

                {/* Feature cards with "Accéder" button */}
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
            </main>
        </div>
    );
};

export default AdminDashboard;