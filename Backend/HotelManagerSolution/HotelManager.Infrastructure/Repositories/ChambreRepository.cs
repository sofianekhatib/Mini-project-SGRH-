using HotelManager.Domain.Entities;
using HotelManager.Domain.Enums;
using HotelManager.Domain.Interfaces;
using HotelManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelManager.Infrastructure.Repositories
{
    public class ChambreRepository : IChambreRepository
    {
        private readonly AppDbContext _context;

        public ChambreRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Chambre?> GetByIdAsync(int id) =>
            await _context.Chambres.FindAsync(id);

        public async Task<IEnumerable<Chambre>> GetAllAsync() =>
            await _context.Chambres.ToListAsync();

        public async Task<Chambre> AddAsync(Chambre chambre)
        {
            await _context.Chambres.AddAsync(chambre);
            await _context.SaveChangesAsync();
            return chambre;
        }

        public async Task UpdateAsync(Chambre chambre)
        {
            _context.Chambres.Update(chambre);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var chambre = await GetByIdAsync(id);
            if (chambre != null)
            {
                _context.Chambres.Remove(chambre);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Chambre>> GetDisponiblesAsync(DateTime debut, DateTime fin)
        {
            var chambresOccupees = await _context.Reservations
                .Where(r => r.Statut == StatutReservation.Confirmee &&
                            r.DateDebut < fin && r.DateFin > debut)
                .Select(r => r.ChambreId)
                .Distinct()
                .ToListAsync();

            return await _context.Chambres
                .Where(c => !chambresOccupees.Contains(c.Id) && c.Statut == StatutChambre.Disponible)
                .ToListAsync();
        }
    }
}