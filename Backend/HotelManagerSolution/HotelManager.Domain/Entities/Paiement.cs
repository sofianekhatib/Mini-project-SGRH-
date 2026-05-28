using System;
using HotelManager.Domain.Enums;

namespace HotelManager.Domain.Entities
{
    public class Paiement
    {
        public int Id { get; set; }
        public decimal Montant { get; set; }
        public DateTime DatePaiement { get; set; } = DateTime.Now;
        public ModePaiement Mode { get; set; }

        public int FactureId { get; set; }
        public Facture Facture { get; set; } = null!;
    }
}