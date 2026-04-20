using HotelManager.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelManager.Domain.Interfaces
{
    public interface IChambreRepository
    {
        Task<Chambre?> GetByIdAsync(int id);
        Task<IEnumerable<Chambre>> GetAllAsync();
        Task<Chambre> AddAsync(Chambre chambre);
        Task UpdateAsync(Chambre chambre);
        Task DeleteAsync(int id);
        Task<IEnumerable<Chambre>> GetDisponiblesAsync(DateTime debut, DateTime fin);
    }
}