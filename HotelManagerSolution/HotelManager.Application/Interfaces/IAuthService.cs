using System.Threading.Tasks;
using HotelManager.Application.DTOs;

namespace HotelManager.Application.Interfaces
{
    public interface IAuthService
    {
        Task<string> AuthenticateAsync(LoginDto loginDto);
        Task<bool> RegisterAsync(string username, string password, string email, string role);
    }
}