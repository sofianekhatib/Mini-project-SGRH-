using HotelManager.Domain.Entities;
using HotelManager.Domain.Enums;
using HotelManager.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManager.API.Controllers
{
    [Authorize(Roles = "Admin")] 
    [Route("api/[controller]")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminDashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats/totals")]
        public async Task<IActionResult> GetTotals()
        {
            var totalChambres = await _context.Chambres.CountAsync();
            var totalClients = await _context.Clients.CountAsync();
            var totalReservations = await _context.Reservations.CountAsync();
            var totalRevenus = await _context.Factures.Where(f => f.EstPayee).SumAsync(f => f.MontantTotal);

            return Ok(new
            {
                totalChambres,
                totalClients,
                totalReservations,
                totalRevenus
            });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.NomUtilisateur,
                    u.Email,
                    Role = u.Role.ToString()
                })
                .ToListAsync();
            return Ok(users);
        }

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.NomUtilisateur == dto.NomUtilisateur))
                return BadRequest("Nom d'utilisateur déjà pris");

            if (!Enum.TryParse<Role>(dto.Role, true, out var role))
                return BadRequest("Rôle invalide. Utilisez 'Admin' ou 'Receptionniste'.");

            var user = new User
            {
                NomUtilisateur = dto.NomUtilisateur,
                Email = dto.Email,
                MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(dto.MotDePasse),
                Role = role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { user.Id, user.NomUtilisateur, user.Email, Role = user.Role.ToString() });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            var adminCount = await _context.Users.CountAsync(u => u.Role == Role.Admin);
            if (user.Role == Role.Admin && adminCount <= 1)
                return BadRequest("Impossible de supprimer le dernier administrateur.");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.NomUtilisateur = dto.NomUtilisateur;
            user.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.MotDePasse))
            {
                user.MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(dto.MotDePasse);
            }

            if (!string.IsNullOrWhiteSpace(dto.Role) && Enum.TryParse<Role>(dto.Role, true, out var role))
            {
                user.Role = role;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class CreateUserDto
    {
        public string NomUtilisateur { get; set; }
        public string Email { get; set; }
        public string MotDePasse { get; set; }
        public string Role { get; set; }  
    }
    public class UpdateUserDto
    {
        public string NomUtilisateur { get; set; }
        public string Email { get; set; }
        public string MotDePasse { get; set; } 
        public string Role { get; set; }
    }
}