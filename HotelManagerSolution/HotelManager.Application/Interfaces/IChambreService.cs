using System.Collections.Generic;
using System.Threading.Tasks;
using HotelManager.Application.DTOs;

namespace HotelManager.Application.Interfaces
{
    public interface IChambreService
    {
        Task<IEnumerable<ChambreDto>> GetAllChambresAsync();
        Task<ChambreDto?> GetChambreByIdAsync(int id);
        Task<ChambreDto> CreateChambreAsync(ChambreDto chambreDto);
        Task UpdateChambreAsync(ChambreDto chambreDto);
        Task DeleteChambreAsync(int id);
        Task<IEnumerable<ChambreDto>> GetChambresDisponiblesAsync(DateTime debut, DateTime fin);
    }
}