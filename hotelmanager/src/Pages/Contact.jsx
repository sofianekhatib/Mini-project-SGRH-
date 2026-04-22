import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
    const navigate = useNavigate();
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
                            <a href="/chambres" className="text-gray-700 hover:text-indigo-600 transition">Chambres</a>
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                        Une question ? Une réservation ? Remplissez ce formulaire.
                    </p>
                </div>
            </div>

            {/* Static form – no logic, no state, no handlers */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Envoyez-nous un message</h2>

                    <form>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    placeholder="Jean Dupont"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    placeholder="jean@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                                    placeholder="Votre message..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full md:w-auto inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                                Envoyer
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-gray-500">
                        <p>Ou contactez-nous directement par téléphone : <strong className="text-indigo-600">+212 07 72 81 78 24</strong></p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">© 2025 HotelManager - Tous droits réservés</p>
                    <div className="flex justify-center gap-6 mt-4">
                        <a href="/contact" className="text-gray-400 hover:text-white transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Contact;