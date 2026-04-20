using HotelManager.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelManager.Domain.Interfaces
{
    public interface IReservationRepository
    {
        Task<Reservation?> GetByIdAsync(int id);
        Task<IEnumerable<Reservation>> GetAllAsync();
        Task<Reservation> AddAsync(Reservation reservation);
        Task UpdateAsync(Reservation reservation);
        Task DeleteAsync(int id);
        Task<IEnumerable<Reservation>> GetByClientIdAsync(int clientId);
        Task<IEnumerable<Reservation>> GetByChambreIdAsync(int chambreId);
    }
}