import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LogOut,
    Hotel,
    Calendar,
    Users,
    BarChart3,
    TrendingUp,
    CheckCircle
} from 'lucide-react';

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

    const menuItems = [
        { title: 'Gestion des chambres', description: 'Ajouter, modifier ou supprimer des chambres', icon: Hotel, color: 'from-blue-500 to-blue-600', link: "/Chambres" },
        { title: 'Gestion des réservations', description: 'Voir toutes les réservations, annuler, modifier', icon: Calendar, color: 'from-green-500 to-green-600' },
        { title: 'Gestion des utilisateurs', description: 'Créer des réceptionnistes, gérer les droits', icon: Users, color: 'from-purple-500 to-purple-600' },
        { title: 'Rapports financiers', description: 'Consulter les factures et paiements', icon: BarChart3, color: 'from-yellow-500 to-yellow-600' },
    ];

    useEffect(() => {
        fetch("https://localhost:7188/api/AdminDashboard/stats/totals", {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => response.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Chargement des statistiques...</div>;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Admin</h1>
                            <p className="mt-1 text-indigo-100">
                                Bienvenue, <span className="font-semibold">{user?.username}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 px-4 py-2 rounded-lg font-medium"
                        >
                            <LogOut size={20} />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 4 cartes statistiques écrites manuellement (sans .map) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Carte Chambres */}
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Chambres totales</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalChambres}</p>
                                </div>
                                <div className="bg-blue-500 p-3 rounded-full text-white shadow-md">
                                    <Hotel size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <CheckCircle size={14} /> Données en temps réel
                            </span>
                        </div>
                    </div>

                    {/* Carte Clients */}
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Clients</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalClients}</p>
                                </div>
                                <div className="bg-green-500 p-3 rounded-full text-white shadow-md">
                                    <Users size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <CheckCircle size={14} /> Données en temps réel
                            </span>
                        </div>
                    </div>

                    {/* Carte Réservations */}
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Réservations</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalReservations}</p>
                                </div>
                                <div className="bg-purple-500 p-3 rounded-full text-white shadow-md">
                                    <Calendar size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <CheckCircle size={14} /> Données en temps réel
                            </span>
                        </div>
                    </div>

                    {/* Carte Revenus */}
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Revenus (€)</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalRevenus} €</p>
                                </div>
                                <div className="bg-yellow-500 p-3 rounded-full text-white shadow-md">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <CheckCircle size={14} /> Données en temps réel
                            </span>
                        </div>
                    </div>
                </div>

                {/* Grille des fonctionnalités (avec map, c'est correct) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                            >
                                <div className={`bg-gradient-to-r ${item.color} p-4 text-white`}>
                                    <Icon size={32} className="group-hover:scale-110 transition-transform duration-200" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 mb-4">{item.description}</p>
                                    <Link to={item.link} className="text-indigo-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Accéder
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
                    © 2025 HotelManager - Tous droits réservés
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;