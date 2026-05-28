using HotelManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelManager.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Chambre> Chambres { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Facture> Factures { get; set; }
        public DbSet<Paiement> Paiements { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Chambre>()
                .Property(c => c.PrixParNuit)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Facture>()
                .Property(f => f.MontantTotal)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Paiement>()
                .Property(p => p.Montant)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Reservation>()
         .HasOne(r => r.Client)
         .WithMany(c => c.Reservations)
         .HasForeignKey(r => r.ClientId)
         .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Chambre)
                .WithMany(c => c.Reservations)
                .HasForeignKey(r => r.ChambreId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Facture>()
                .HasOne(f => f.Reservation)
                .WithOne(r => r.Facture)
                .HasForeignKey<Facture>(f => f.ReservationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Paiement>()
                .HasOne(p => p.Facture)
                .WithMany(f => f.Paiements)
                .HasForeignKey(p => p.FactureId);

            modelBuilder.Entity<Client>()
                .HasIndex(c => c.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.NomUtilisateur)
                .IsUnique();
        }
    }
}