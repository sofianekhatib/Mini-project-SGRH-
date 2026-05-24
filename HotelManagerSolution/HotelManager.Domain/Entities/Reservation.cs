namespace HotelManager.Domain.Entities
{
    using HotelManager.Domain.Enums;

    public class Reservation
    {
        public int Id { get; set; }
        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }
        public StatutReservation Statut { get; set; }
        public DateTime DateReservation { get; set; }

        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;

        public int ChambreId { get; set; }
        public Chambre Chambre { get; set; } = null!;

        public Facture? Facture { get; set; }
    }
}