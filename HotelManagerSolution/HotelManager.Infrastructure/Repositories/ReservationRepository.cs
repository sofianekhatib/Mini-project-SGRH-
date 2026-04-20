using HotelManager.Domain.Entities;
using HotelManager.Domain.Interfaces;
using HotelManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelManager.Infrastructure.Repositories
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly AppDbContext _context;

        public ReservationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Reservation?> GetByIdAsync(int id) =>
            await _context.Reservations.FindAsync(id);

        public async Task<IEnumerable<Reservation>> GetAllAsync() =>
            await _context.Reservations.ToListAsync();

        public async Task<Reservation> AddAsync(Reservation reservation)
        {
            await _context.Reservations.AddAsync(reservation);
            await _context.SaveChangesAsync();
            return reservation;
        }

        public async Task UpdateAsync(Reservation reservation)
        {
            _context.Reservations.Update(reservation);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var reservation = await GetByIdAsync(id);
            if (reservation != null)
            {
                _context.Reservations.Remove(reservation);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Reservation>> GetByClientIdAsync(int clientId) =>
            await _context.Reservations.Where(r => r.ClientId == clientId).ToListAsync();

        public async Task<IEnumerable<Reservation>> GetByChambreIdAsync(int chambreId) =>
            await _context.Reservations.Where(r => r.ChambreId == chambreId).ToListAsync();
    }
}