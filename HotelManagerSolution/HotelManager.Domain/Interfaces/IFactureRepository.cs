using HotelManager.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelManager.Domain.Interfaces
{
    public interface IFactureRepository
    {
        Task<Facture?> GetByIdAsync(int id);
        Task<IEnumerable<Facture>> GetAllAsync();
        Task<Facture> AddAsync(Facture facture);
        Task UpdateAsync(Facture facture);
        Task<Facture?> GetByReservationIdAsync(int reservationId);
    }
}