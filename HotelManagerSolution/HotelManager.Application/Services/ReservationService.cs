using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using HotelManager.Domain.Entities;
using HotelManager.Domain.Enums;
using HotelManager.Domain.Interfaces;

namespace HotelManager.Application.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IReservationRepository _reservationRepository;
        private readonly IChambreRepository _chambreRepository;
        private readonly IClientRepository _clientRepository;
        private readonly IFactureRepository _factureRepository;

        public ReservationService(
            IReservationRepository reservationRepository,
            IChambreRepository chambreRepository,
            IClientRepository clientRepository,
            IFactureRepository factureRepository)
        {
            _reservationRepository = reservationRepository;
            _chambreRepository = chambreRepository;
            _clientRepository = clientRepository;
            _factureRepository = factureRepository;
        }

        public async Task<IEnumerable<ReservationDto>> GetAllReservationsAsync()
        {
            var reservations = await _reservationRepository.GetAllAsync();
            return await MapToDto(reservations);
        }

        public async Task<ReservationDto?> GetReservationByIdAsync(int id)
        {
            var res = await _reservationRepository.GetByIdAsync(id);
            if (res == null) return null;
            return (await MapToDto(new[] { res })).FirstOrDefault();
        }

        public async Task<ReservationDto> CreateReservationAsync(CreateReservationDto dto)
        {
            // Vérifier disponibilité
            var chambre = await _chambreRepository.GetByIdAsync(dto.ChambreId);
            if (chambre == null) throw new Exception("Chambre inexistante");
            var disponibles = await _chambreRepository.GetDisponiblesAsync(dto.DateDebut, dto.DateFin);
            if (!disponibles.Any(c => c.Id == dto.ChambreId))
                throw new Exception("Chambre non disponible sur ces dates");

            var reservation = new Reservation
            {
                DateDebut = dto.DateDebut,
                DateFin = dto.DateFin,
                ClientId = dto.ClientId,
                ChambreId = dto.ChambreId,
                Statut = StatutReservation.Confirmee,
                DateReservation = DateTime.Now
            };
            var created = await _reservationRepository.AddAsync(reservation);

            // Créer la facture associée
            var nbNuits = (dto.DateFin - dto.DateDebut).Days;
            var montant = nbNuits * chambre.PrixParNuit;
            var facture = new Facture
            {
                ReservationId = created.Id,
                MontantTotal = montant,
                DateEmission = DateTime.Now,
                EstPayee = false
            };
            await _factureRepository.AddAsync(facture);

            return (await MapToDto(new[] { created })).FirstOrDefault()!;
        }

        public async Task CancelReservationAsync(int id)
        {
            var reservation = await _reservationRepository.GetByIdAsync(id);
            if (reservation == null) throw new KeyNotFoundException();
            reservation.Statut = StatutReservation.Annulee;
            await _reservationRepository.UpdateAsync(reservation);
        }

        public async Task<IEnumerable<ReservationDto>> GetReservationsByClientAsync(int clientId)
        {
            var reservations = await _reservationRepository.GetByClientIdAsync(clientId);
            return await MapToDto(reservations);
        }

        private async Task<IEnumerable<ReservationDto>> MapToDto(IEnumerable<Reservation> reservations)
        {
            var dtos = new List<ReservationDto>();
            foreach (var r in reservations)
            {
                var client = await _clientRepository.GetByIdAsync(r.ClientId);
                var chambre = await _chambreRepository.GetByIdAsync(r.ChambreId);
                dtos.Add(new ReservationDto
                {
                    Id = r.Id,
                    DateDebut = r.DateDebut,
                    DateFin = r.DateFin,
                    Statut = r.Statut,
                    DateReservation = r.DateReservation,
                    ClientId = r.ClientId,
                    ClientNomComplet = client != null ? $"{client.Prenom} {client.Nom}" : "",
                    ChambreId = r.ChambreId,
                    ChambreNumero = chambre?.Numero ?? ""
                });
            }
            return dtos;
        }
    }
}