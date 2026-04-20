using HotelManager.Domain.Enums;

namespace HotelManager.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string NomUtilisateur { get; set; } = string.Empty;
        public string MotDePasseHash { get; set; } = string.Empty; // stocké hashé
        public string Email { get; set; } = string.Empty;
        public Role Role { get; set; } = Role.Receptionniste;
    }
}