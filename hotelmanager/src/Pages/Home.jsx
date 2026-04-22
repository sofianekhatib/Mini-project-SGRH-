import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch("https://localhost:7188/api/Chambre", {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setRooms(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Impossible de charger les chambres.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Chargement des chambres...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                            <a href="./Services" className="text-gray-700 hover:text-indigo-600 transition">Services</a>
                            <a href="./Contact" className="text-gray-700 hover:text-indigo-600 transition">Contact</a>
                        </div>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Nos chambres</h2>
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                        Des espaces pensés pour votre confort, avec des prestations haut de gamme.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-slate-800">Chambre {item.numero}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                    ${item.statut === 0 ? 'bg-green-100 text-green-700' :
                                        item.statut === 1 ? 'bg-red-100 text-red-700' :
                                            item.statut === 2 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'}`}
                                >
                                    {item.statut === 0 ? 'Disponible' : item.statut === 1 ? 'Occupée' : item.statut === 2 ? 'En nettoyage' : 'Hors service'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mb-1">Type : <span className="text-slate-700">{item.type}</span></p>
                            <p className="text-sm text-slate-500 mb-1">Prix : <span className="text-slate-700 font-medium">{item.prixParNuit} € / nuit</span></p>
                            {item.description && (
                                <p className="text-sm text-slate-500 mt-2 pt-2 border-t border-slate-100">{item.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">© 2025 HotelManager - Tous droits réservés</p>
                    <div className="flex justify-center gap-6 mt-4">
                        <a href="./Contact" className="text-gray-400 hover:text-white transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;