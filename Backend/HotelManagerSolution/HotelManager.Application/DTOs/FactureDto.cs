using System;
using System.Collections.Generic;

namespace HotelManager.Application.DTOs
{
    public class FactureDto
    {
        public int Id { get; set; }
        public decimal MontantTotal { get; set; }
        public DateTime DateEmission { get; set; }
        public bool EstPayee { get; set; }
        public int ReservationId { get; set; }
        public List<PaiementDto> Paiements { get; set; } = new();
    }

    public class PaiementDto
    {
        public int Id { get; set; }
        public decimal Montant { get; set; }
        public DateTime DatePaiement { get; set; }
        public string Mode { get; set; } = string.Empty;
    }
}