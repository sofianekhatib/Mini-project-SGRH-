import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut,
    Calendar,
    PlusCircle,
    FileText,
    User,
    CreditCard,
    Bell,
    Home
} from 'lucide-react';

const ClientDashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    // Données simulées pour les cartes statistiques
    const stats = [
        { label: 'Réservations actives', value: '2', icon: Calendar, color: 'bg-blue-500' },
        { label: 'Séjours passés', value: '4', icon: Home, color: 'bg-green-500' },
        { label: 'Points fidélité', value: '850', icon: CreditCard, color: 'bg-purple-500' },
        { label: 'Notifications', value: '3', icon: Bell, color: 'bg-yellow-500' },
    ];

    const menuItems = [
        { title: 'Mes réservations', description: 'Consultez et gérez vos réservations en cours', icon: Calendar, color: 'from-blue-500 to-blue-600' },
        { title: 'Nouvelle réservation', description: 'Réservez une chambre selon vos dates', icon: PlusCircle, color: 'from-green-500 to-green-600' },
        { title: 'Mes factures', description: 'Historique des paiements et factures', icon: FileText, color: 'from-purple-500 to-purple-600' },
        { title: 'Mon profil', description: 'Modifiez vos informations personnelles', icon: User, color: 'from-yellow-500 to-yellow-600' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header avec dégradé */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Mon espace client</h1>
                            <p className="mt-1 text-emerald-100">
                                Bonjour, <span className="font-semibold">{user?.username}</span>
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

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Cartes statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                                        </div>
                                        <div className={`${stat.color} p-3 rounded-full text-white shadow-md`}>
                                            <Icon size={24} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">Mise à jour récente</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Grille des fonctionnalités */}
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
                                    <button className="text-emerald-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Accéder
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pied de page */}
                <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
                    © 2025 HotelManager - Gérez vos séjours en toute simplicité
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;