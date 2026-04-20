using System.Threading.Tasks;
using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var token = await _authService.AuthenticateAsync(loginDto);
            if (token == null)
                return Unauthorized("Nom d'utilisateur ou mot de passe incorrect");
            return Ok(new { Token = token });
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto.Username, dto.Password, dto.Email, dto.Role);
            if (!result)
                return BadRequest("Nom d'utilisateur déjà pris");
            return Ok("Utilisateur créé");
        }
    }
}