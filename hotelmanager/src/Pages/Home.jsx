import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, BedDouble } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const rooms = [
        {
            id: 1,
            name: 'Chambre Simple',
            price: '80€',
            description: 'Confortable et bien équipée, parfaite pour une personne.',
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
            amenities: ['Lit simple', 'Wi-Fi', 'Climatisation'],
            icon: BedDouble,
        },
        {
            id: 2,
            name: 'Chambre Double',
            price: '120€',
            description: 'Idéale pour les couples ou les voyages d’affaires.',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
            amenities: ['Lit double', 'Wi-Fi', 'Climatisation', 'Télévision'],
            icon: BedDouble,
        },
        {
            id: 3,
            name: 'Suite Luxe',
            price: '250€',
            description: 'Espace, élégance et confort pour un séjour inoubliable.',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
            amenities: ['Lit king size', 'Jacuzzi', 'Terrasse', 'Mini-bar'],
            icon: Hotel,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Barre de navigation */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <Hotel className="h-8 w-8 text-indigo-600" />
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                HotelManager
                            </span>
                        </div>

                        {/* Liens de navigation (simulés) */}
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Accueil</a>
                            <a href="./Chambres" className="text-gray-700 hover:text-indigo-600 transition">Chambres</a>
                            <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Services</a>
                            <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Contact</a>
                        </div>

                        {/* Bouton Connexion/Inscription */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="hidden sm:block text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Connexion
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
                            >
                                S'inscrire
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Section Héro */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenue à l'HôtelManager</h1>
                    <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto">
                        Découvrez un séjour d'exception dans un cadre élégant et moderne.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="mt-8 bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
                    >
                        Réservez maintenant
                    </button>
                </div>
            </div>

            {/* Section des chambres */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Nos chambres</h2>
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                        Des espaces pensés pour votre confort, avec des prestations haut de gamme.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room) => {
                        const Icon = room.icon;
                        return (
                            <div
                                key={room.id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-indigo-600 shadow">
                                        {room.price}/nuit
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className="h-5 w-5 text-indigo-500" />
                                        <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">{room.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {room.amenities.map((item, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-100 transition"
                                    >
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pied de page */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">© 2025 HotelManager - Tous droits réservés</p>
                    <div className="flex justify-center gap-6 mt-4">
                        <a href="#" className="text-gray-400 hover:text-white transition">Mentions légales</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">Confidentialité</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;