using HotelManager.Domain.Entities;
using HotelManager.Domain.Interfaces;
using HotelManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HotelManager.Infrastructure.Repositories
{
    public class FactureRepository : IFactureRepository
    {
        private readonly AppDbContext _context;

        public FactureRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Facture?> GetByIdAsync(int id) =>
            await _context.Factures.FindAsync(id);

        public async Task<IEnumerable<Facture>> GetAllAsync() =>
            await _context.Factures.ToListAsync();

        public async Task<Facture> AddAsync(Facture facture)
        {
            await _context.Factures.AddAsync(facture);
            await _context.SaveChangesAsync();
            return facture;
        }

        public async Task UpdateAsync(Facture facture)
        {
            _context.Factures.Update(facture);
            await _context.SaveChangesAsync();
        }

        public async Task<Facture?> GetByReservationIdAsync(int reservationId) =>
            await _context.Factures.FirstOrDefaultAsync(f => f.ReservationId == reservationId);
    }
}