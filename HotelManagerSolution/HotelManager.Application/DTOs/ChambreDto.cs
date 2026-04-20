using HotelManager.Domain.Enums;

namespace HotelManager.Application.DTOs
{
    public class ChambreDto
    {
        public int Id { get; set; }
        public string Numero { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal PrixParNuit { get; set; }
        public StatutChambre Statut { get; set; }
        public string? Description { get; set; }
    }
}