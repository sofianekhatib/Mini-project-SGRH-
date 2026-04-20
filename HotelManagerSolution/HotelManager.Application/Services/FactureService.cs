using System.Linq;
using System.Threading.Tasks;
using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using HotelManager.Domain.Entities;
using HotelManager.Domain.Enums;
using HotelManager.Domain.Interfaces;

namespace HotelManager.Application.Services
{
    public class FactureService : IFactureService
    {
        private readonly IFactureRepository _factureRepository;
        private readonly IPaiementRepository _paiementRepository;

        public FactureService(IFactureRepository factureRepository, IPaiementRepository paiementRepository)
        {
            _factureRepository = factureRepository;
            _paiementRepository = paiementRepository;
        }

        public async Task<FactureDto?> GetFactureByReservationIdAsync(int reservationId)
        {
            var facture = await _factureRepository.GetByReservationIdAsync(reservationId);
            if (facture == null) return null;

            var paiements = await _paiementRepository.GetByFactureIdAsync(facture.Id);
            return new FactureDto
            {
                Id = facture.Id,
                MontantTotal = facture.MontantTotal,
                DateEmission = facture.DateEmission,
                EstPayee = facture.EstPayee,
                ReservationId = facture.ReservationId,
                Paiements = paiements.Select(p => new PaiementDto
                {
                    Id = p.Id,
                    Montant = p.Montant,
                    DatePaiement = p.DatePaiement,
                    Mode = p.Mode.ToString()
                }).ToList()
            };
        }

        public async Task<bool> PayerFactureAsync(int factureId, PaiementDto paiementDto)
        {
            var facture = await _factureRepository.GetByIdAsync(factureId);
            if (facture == null) return false;

            var paiement = new Paiement
            {
                Montant = paiementDto.Montant,
                DatePaiement = paiementDto.DatePaiement,
                Mode = Enum.Parse<ModePaiement>(paiementDto.Mode, true),
                FactureId = factureId
            };
            await _paiementRepository.AddAsync(paiement);

            // Vérifier si la facture est totalement payée
            var totalPaye = (await _paiementRepository.GetByFactureIdAsync(factureId)).Sum(p => p.Montant);
            if (totalPaye >= facture.MontantTotal)
            {
                facture.EstPayee = true;
                await _factureRepository.UpdateAsync(facture);
            }
            return true;
        }
    }
}