using System.Collections.Generic;
using System.Threading.Tasks;
using HotelManager.Application.DTOs;

namespace HotelManager.Application.Interfaces
{
    public interface IReservationService
    {
        Task<IEnumerable<ReservationDto>> GetAllReservationsAsync();
        Task<ReservationDto?> GetReservationByIdAsync(int id);
        Task<ReservationDto> CreateReservationAsync(CreateReservationDto dto);
        Task CancelReservationAsync(int id);
        Task<IEnumerable<ReservationDto>> GetReservationsByClientAsync(int clientId);
    }
}