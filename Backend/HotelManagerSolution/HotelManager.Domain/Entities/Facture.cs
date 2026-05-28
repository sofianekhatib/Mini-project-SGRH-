using System;
using System.Collections.Generic;

namespace HotelManager.Domain.Entities
{
    public class Facture
    {
        public int Id { get; set; }
        public decimal MontantTotal { get; set; }
        public DateTime DateEmission { get; set; } = DateTime.Now;
        public bool EstPayee { get; set; } = false;

        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; } = null!;

        public ICollection<Paiement> Paiements { get; set; } = new List<Paiement>();
    }
}