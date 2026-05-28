using System;

namespace HotelManager.Application.DTOs
{
    public class CreateReservationDto
    {
        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }
        public int ClientId { get; set; }
        public int ChambreId { get; set; }
    }
}