using HotelManager.Domain.Entities;
using HotelManager.Domain.Interfaces;
using HotelManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelManager.Infrastructure.Repositories
{
    public class PaiementRepository : IPaiementRepository
    {
        private readonly AppDbContext _context;

        public PaiementRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Paiement?> GetByIdAsync(int id) =>
            await _context.Paiements.FindAsync(id);

        public async Task<IEnumerable<Paiement>> GetAllAsync() =>
            await _context.Paiements.ToListAsync();

        public async Task<Paiement> AddAsync(Paiement paiement)
        {
            await _context.Paiements.AddAsync(paiement);
            await _context.SaveChangesAsync();
            return paiement;
        }

        public async Task UpdateAsync(Paiement paiement)
        {
            _context.Paiements.Update(paiement);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Paiement>> GetByFactureIdAsync(int factureId) =>
            await _context.Paiements.Where(p => p.FactureId == factureId).ToListAsync();
    }
}