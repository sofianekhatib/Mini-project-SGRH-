using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using HotelManager.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HotelManager.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;
        private readonly AppDbContext _context;

        public ClientController(IClientService clientService, AppDbContext context)
        {
            _clientService = clientService;
            _context = context;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentClient()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized("User ID not found in token");

            var client = await _context.Clients
                .Where(c => c.UserId == userId)
                .Select(c => new { c.Id, c.Nom, c.Prenom, c.Email, c.Telephone, c.Adresse })
                .FirstOrDefaultAsync();

            if (client == null)
                return NotFound("No client profile found for this user");

            return Ok(client);
        }

        [HttpGet("by-email/{email}")]
        public async Task<IActionResult> GetClientByEmail(string email)
        {
            var client = await _context.Clients
                .Where(c => c.Email == email)
                .Select(c => new { c.Id, c.Nom, c.Prenom, c.Email, c.Telephone, c.Adresse })
                .FirstOrDefaultAsync();
            if (client == null) return NotFound("No client found for this email");
            return Ok(client);
        }

        [HttpGet("{id}", Name = "GetById")]
        public async Task<IActionResult> GetById(int id)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var currentClient = await _context.Clients.FirstOrDefaultAsync(c => c.UserId == userId);
            bool isSelf = (currentClient != null && currentClient.Id == id);

            if (role == "Admin" || role == "Receptionniste" || isSelf)
            {
                var client = await _context.Clients
                    .Where(c => c.Id == id)
                    .Select(c => new ClientDto
                    {
                        Id = c.Id,
                        Nom = c.Nom,
                        Prenom = c.Prenom,
                        Email = c.Email,
                        Telephone = c.Telephone,
                        Adresse = c.Adresse
                    })
                    .FirstOrDefaultAsync();

                if (client == null)
                    return NotFound();

                return Ok(client);
            }
            return Forbid();
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clients = await _clientService.GetAllClientsAsync();
            return Ok(clients);
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpPost]
        public async Task<IActionResult> Create(ClientDto dto)
        {
            var created = await _clientService.CreateClientAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ClientDto dto)
        {
            if (id != dto.Id) return BadRequest();
            await _clientService.UpdateClientAsync(dto);
            return NoContent();
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _clientService.DeleteClientAsync(id);
            return NoContent();
        }
    }
}