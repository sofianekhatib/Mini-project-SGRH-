import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Coffee, Car, Utensils, Dumbbell, Sparkles } from 'lucide-react';

const Services = () => {
    const navigate = useNavigate();

    const servicesList = [
        { icon: Wifi, title: 'Wi-Fi haut débit', description: 'Connexion internet gratuite dans toutes les chambres et espaces communs.' },
        { icon: Coffee, title: 'Petit-déjeuner buffet', description: 'Buffet varié avec produits frais et locaux, servi de 7h à 10h.' },
        { icon: Car, title: 'Parking sécurisé', description: 'Parking privé gratuit sur réservation.' },
        { icon: Utensils, title: 'Restaurant gastronomique', description: 'Cuisine raffinée mettant à l’honneur les produits de saison.' },
        { icon: Dumbbell, title: 'Salle de sport', description: 'Équipements modernes pour garder la forme pendant votre séjour.' },
        { icon: Sparkles, title: 'Spa & bien-être', description: 'Massages, sauna et hammam pour une détente absolue.' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation (same as Home) */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                HotelManager
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <a href="/" className="text-gray-700 hover:text-indigo-600 transition">Accueil</a>
                            <a href="/services" className="text-gray-700 hover:text-indigo-600 transition">Services</a>
                            <a href="/contact" className="text-gray-700 hover:text-indigo-600 transition">Contact</a>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/login')} className="hidden sm:block text-indigo-600 hover:text-indigo-700 font-medium">Connexion</button>
                            <button onClick={() => navigate('/register')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">S'inscrire</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos services</h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                        Des prestations conçues pour rendre votre séjour unique et confortable.
                    </p>
                </div>
            </div>

            {/* Services grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesList.map((service, idx) => {
                        const Icon = service.icon;
                        return (
                            <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-slate-100">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                    <Icon className="h-6 w-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer (same as Home) */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">© 2025 HotelManager - Tous droits réservés</p>
                    <div className="flex justify-center gap-6 mt-4">
                        <a href="#" className="text-gray-400 hover:text-white transition">Mentions légales</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">Confidentialité</a>
                        <a href="/contact" className="text-gray-400 hover:text-white transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Services;