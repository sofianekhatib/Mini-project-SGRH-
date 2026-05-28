using HotelManager.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelManager.Domain.Interfaces
{
    public interface IPaiementRepository
    {
        Task<Paiement?> GetByIdAsync(int id);
        Task<IEnumerable<Paiement>> GetAllAsync();
        Task<Paiement> AddAsync(Paiement paiement);
        Task UpdateAsync(Paiement paiement);
        Task<IEnumerable<Paiement>> GetByFactureIdAsync(int factureId);
    }
}