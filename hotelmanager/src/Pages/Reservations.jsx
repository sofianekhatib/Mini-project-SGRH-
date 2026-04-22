import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Reservations() {
    var [reservations, setReservations] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    useEffect(() => {
        setError('')
        setSuccess('')
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please login');
            return;
        }

        fetch("https://localhost:7188/api/Reservation", {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => setReservations(data))
            .catch(err => console.log(err));
    }, []);
    return (
        <div className="p-6 max-w-7xl mx-auto relative">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm -mx-6 px-6 py-2 shadow-sm mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-800">Réservations</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/CreateReservation"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition border border-indigo-600 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Ajouter Réservation
                        </Link>

                        <Link
                            to="/AdminDashboard"
                            className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition shadow-sm"
                        >
                            ← Retour
                        </Link>
                    </div>
                </div>
            </div>
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    ⚠️ {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    ✅ {success}
                </div>
            )}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50/90 border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">ID</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date Debut</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date Fin</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Statut</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date Reservation</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Client Associe</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Chambre Associe</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reservations.map((item) => (
                            <tr className="hover:bg-slate-50/60 transition">
                                <td className="px-5 py-4 font-mono text-xs text-slate-500">{item.id}</td>
                                <td className="px-5 py-4 font-medium text-slate-800">{item.DateDebut}</td>
                                <td className="px-5 py-4 text-slate-700">{item.DateFin}</td>
                                <td className="px-5 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        {item.statut}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-slate-600">{item.DateReservation}</td>
                                <td className="px-5 py-4 font-medium text-slate-800">{item.ClientId}</td>
                                <td className="px-5 py-4 font-medium text-slate-800">{item.ChambreId}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium rounded-lg border border-amber-200 shadow-sm transition cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                                            </svg>
                                            Update
                                        </button>
                                        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium rounded-lg border border-rose-200 shadow-sm transition cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                <path d="M8 4V2h8v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}