using System;
using System.Threading.Tasks;
using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManager.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChambreController : ControllerBase
    {
        private readonly IChambreService _chambreService;

        public ChambreController(IChambreService chambreService)
        {
            _chambreService = chambreService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _chambreService.GetAllChambresAsync());

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var chambre = await _chambreService.GetChambreByIdAsync(id);
            if (chambre == null) return NotFound();
            return Ok(chambre);
        }

        [AllowAnonymous]
        [HttpGet("disponibles")]
        public async Task<IActionResult> GetDisponibles(DateTime debut, DateTime fin) =>
            Ok(await _chambreService.GetChambresDisponiblesAsync(debut, fin));

        [HttpPost]
        public async Task<IActionResult> Create(ChambreDto dto)
        {
            var created = await _chambreService.CreateChambreAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ChambreDto dto)
        {
            if (id != dto.Id) return BadRequest();
            await _chambreService.UpdateChambreAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _chambreService.DeleteChambreAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}