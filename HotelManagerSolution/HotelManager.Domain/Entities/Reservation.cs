using System;
using HotelManager.Domain.Enums;

namespace HotelManager.Domain.Entities
{
    public class Reservation
    {
        public int Id { get; set; }
        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }
        public StatutReservation Statut { get; set; } = StatutReservation.Confirmee;
        public DateTime DateReservation { get; set; } = DateTime.Now;

        // Clés étrangères
        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;

        public int ChambreId { get; set; }
        public Chambre Chambre { get; set; } = null!;

        // Navigation
        public Facture? Facture { get; set; }
    }
}