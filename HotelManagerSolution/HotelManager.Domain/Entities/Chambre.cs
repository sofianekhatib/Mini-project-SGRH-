using HotelManager.Domain.Enums;
using System.Collections.Generic;

namespace HotelManager.Domain.Entities
{
    public class Chambre
    {
        public int Id { get; set; }
        public string Numero { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Simple, Double, Suite
        public decimal PrixParNuit { get; set; }
        public StatutChambre Statut { get; set; } = StatutChambre.Disponible;
        public string? Description { get; set; }

        // Navigation
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}