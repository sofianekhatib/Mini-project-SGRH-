using System;
using HotelManager.Domain.Enums;

namespace HotelManager.Application.DTOs
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }
        public StatutReservation Statut { get; set; }
        public DateTime DateReservation { get; set; }
        public int ClientId { get; set; }
        public string ClientNomComplet { get; set; } = string.Empty;
        public int ChambreId { get; set; }
        public string ChambreNumero { get; set; } = string.Empty;
    }
}