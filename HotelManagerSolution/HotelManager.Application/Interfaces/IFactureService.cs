using System.Threading.Tasks;
using HotelManager.Application.DTOs;

namespace HotelManager.Application.Interfaces
{
    public interface IFactureService
    {
        Task<FactureDto?> GetFactureByReservationIdAsync(int reservationId);
        Task<bool> PayerFactureAsync(int factureId, PaiementDto paiementDto);
    }
}