using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using HotelManager.Domain.Entities;
using HotelManager.Domain.Interfaces;

namespace HotelManager.Application.Services
{
    public class ChambreService : IChambreService
    {
        private readonly IChambreRepository _chambreRepository;
        private readonly IReservationRepository _reservationRepository;

        public ChambreService(IChambreRepository chambreRepository, IReservationRepository reservationRepository)
        {
            _chambreRepository = chambreRepository;
            _reservationRepository = reservationRepository;
        }

        public async Task<IEnumerable<ChambreDto>> GetAllChambresAsync()
        {
            var chambres = await _chambreRepository.GetAllAsync();
            return chambres.Select(c => new ChambreDto
            {
                Id = c.Id,
                Numero = c.Numero,
                Type = c.Type,
                PrixParNuit = c.PrixParNuit,
                Statut = c.Statut,
                Description = c.Description
            });
        }

        public async Task<ChambreDto?> GetChambreByIdAsync(int id)
        {
            var c = await _chambreRepository.GetByIdAsync(id);
            if (c == null) return null;
            return new ChambreDto
            {
                Id = c.Id,
                Numero = c.Numero,
                Type = c.Type,
                PrixParNuit = c.PrixParNuit,
                Statut = c.Statut,
                Description = c.Description
            };
        }

        public async Task<ChambreDto> CreateChambreAsync(ChambreDto dto)
        {
            var chambre = new Chambre
            {
                Numero = dto.Numero,
                Type = dto.Type,
                PrixParNuit = dto.PrixParNuit,
                Statut = dto.Statut,
                Description = dto.Description
            };
            var created = await _chambreRepository.AddAsync(chambre);
            dto.Id = created.Id;
            return dto;
        }

        public async Task UpdateChambreAsync(ChambreDto dto)
        {
            var chambre = await _chambreRepository.GetByIdAsync(dto.Id);
            if (chambre == null) throw new KeyNotFoundException();
            chambre.Numero = dto.Numero;
            chambre.Type = dto.Type;
            chambre.PrixParNuit = dto.PrixParNuit;
            chambre.Statut = dto.Statut;
            chambre.Description = dto.Description;
            await _chambreRepository.UpdateAsync(chambre);
        }

        public async Task DeleteChambreAsync(int id)
        {
            var chambre = await _chambreRepository.GetByIdAsync(id);
            if (chambre == null)
                throw new KeyNotFoundException($"Chambre {id} non trouvée");

            var reservations = await _reservationRepository.GetByChambreIdAsync(id);
            if (reservations.Any())
                throw new InvalidOperationException("Impossible de supprimer cette chambre car elle a des réservations associées.");

            await _chambreRepository.DeleteAsync(id);
        }
        public async Task<IEnumerable<ChambreDto>> GetChambresDisponiblesAsync(DateTime debut, DateTime fin)
        {
            var chambres = await _chambreRepository.GetDisponiblesAsync(debut, fin);
            return chambres.Select(c => new ChambreDto
            {
                Id = c.Id,
                Numero = c.Numero,
                Type = c.Type,
                PrixParNuit = c.PrixParNuit,
                Statut = c.Statut,
                Description = c.Description
            });
        }
    }
}