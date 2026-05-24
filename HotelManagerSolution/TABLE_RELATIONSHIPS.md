# Hotel Manager - Database Table Relationships

## Overview
The database consists of 7 main tables with well-defined relationships for managing a hotel reservation system.

---

## Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATABASE STRUCTURE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

							  ┌──────────────┐
							  │     User     │
							  ├──────────────┤
							  │ Id (PK)      │
							  │ NomUtilisateur
							  │ MotDePasseHash
							  │ Email        │
							  │ Role         │
							  └──────────────┘
									▲
									│ 1:1
									│ UserId
									│
							  ┌──────────────┐
							  │    Client    │
							  ├──────────────┤
							  │ Id (PK)      │
							  │ Nom          │
							  │ Prenom       │
							  │ Email (UQ)   │
							  │ Telephone    │
							  │ Adresse      │
							  │ UserId (FK)  │◄──── Foreign Key to User
							  └──────────────┘
									▲
									│ 1:Many
									│
					┌───────────────┴───────────────┐
					│                               │
			  ┌──────────────┐               ┌──────────────┐
			  │ Reservation  │               │    Chambre   │
			  ├──────────────┤               ├──────────────┤
			  │ Id (PK)      │               │ Id (PK)      │
			  │ DateDebut    │               │ Numero       │
			  │ DateFin      │               │ Type         │
			  │ Statut       │               │ PrixParNuit  │
			  │ DateReservation              │ Statut       │
			  │ ClientId (FK)├──────┐        │ Description  │
			  │ ChambreId (FK)◄─────┼───────┤              │
			  └──────────────┘      │       └──────────────┘
					│               │ Many:Many
					│ 1:1           │
					▼               │ (via Reservation)
			  ┌──────────────┐      │
			  │    Facture   │      │
			  ├──────────────┤      │
			  │ Id (PK)      │      │
			  │ MontantTotal │      │
			  │ DateEmission │      │
			  │ EstPayee     │      │
			  │ ReservationId├──────┘
			  │   (FK)       │
			  └──────────────┘
					▲
					│ 1:Many
					│
			  ┌──────────────┐
			  │   Paiement   │
			  ├──────────────┤
			  │ Id (PK)      │
			  │ Montant      │
			  │ DatePaiement │
			  │ Mode         │
			  │ FactureId (FK)
			  └──────────────┘

			  ┌──────────────┐
			  │   Contact    │
			  ├──────────────┤
			  │ Id (PK)      │
			  │ NomComplet   │
			  │ Email        │
			  │ Message      │
			  └──────────────┘
			  (Standalone - No relationships)
```

---

## Detailed Table Relationships

### 1. **User** ↔ **Client** (1:1)
- **Relationship Type**: One-to-One
- **Foreign Key**: `Client.UserId` → `User.Id`
- **Delete Behavior**: Not explicitly set (Cascade by default)
- **Purpose**: Link user accounts to client profiles
- **Example**: User "johndoe" (login account) is linked to Client "John Doe" (guest profile)

```csharp
public int UserId { get; set; }
public User User { get; set; } = null!;
```

---

### 2. **Client** ↔ **Reservation** (1:Many)
- **Relationship Type**: One-to-Many
- **Foreign Key**: `Reservation.ClientId` → `Client.Id`
- **Delete Behavior**: `DeleteBehavior.Restrict` (cannot delete client with active reservations)
- **Purpose**: Track all reservations for a specific client
- **Example**: Client "John Doe" can have multiple reservations

```csharp
// In Client entity
public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

// In Reservation entity
public int ClientId { get; set; }
public Client Client { get; set; } = null!;
```

**ModelBuilder Configuration**:
```csharp
modelBuilder.Entity<Reservation>()
	.HasOne(r => r.Client)
	.WithMany(c => c.Reservations)
	.HasForeignKey(r => r.ClientId)
	.OnDelete(DeleteBehavior.Restrict);
```

---

### 3. **Chambre** ↔ **Reservation** (1:Many)
- **Relationship Type**: One-to-Many
- **Foreign Key**: `Reservation.ChambreId` → `Chambre.Id`
- **Delete Behavior**: `DeleteBehavior.Restrict` (cannot delete room with active reservations)
- **Purpose**: Track all reservations for a specific room
- **Example**: Room "101" can have multiple reservations at different dates

```csharp
// In Chambre entity
public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

// In Reservation entity
public int ChambreId { get; set; }
public Chambre Chambre { get; set; } = null!;
```

**ModelBuilder Configuration**:
```csharp
modelBuilder.Entity<Reservation>()
	.HasOne(r => r.Chambre)
	.WithMany(c => c.Reservations)
	.HasForeignKey(r => r.ChambreId)
	.OnDelete(DeleteBehavior.Restrict);
```

---

### 4. **Reservation** ↔ **Facture** (1:1)
- **Relationship Type**: One-to-One
- **Foreign Key**: `Facture.ReservationId` → `Reservation.Id`
- **Delete Behavior**: `DeleteBehavior.Cascade` (deleting reservation deletes its invoice)
- **Purpose**: Each reservation generates exactly one invoice
- **Example**: Reservation #001 has one Invoice #001

```csharp
// In Reservation entity
public Facture? Facture { get; set; }

// In Facture entity
public int ReservationId { get; set; }
public Reservation Reservation { get; set; } = null!;
```

**ModelBuilder Configuration**:
```csharp
modelBuilder.Entity<Facture>()
	.HasOne(f => f.Reservation)
	.WithOne(r => r.Facture)
	.HasForeignKey<Facture>(f => f.ReservationId)
	.OnDelete(DeleteBehavior.Cascade);
```

---

### 5. **Facture** ↔ **Paiement** (1:Many)
- **Relationship Type**: One-to-Many
- **Foreign Key**: `Paiement.FactureId` → `Facture.Id`
- **Delete Behavior**: Not explicitly set (Cascade by default)
- **Purpose**: Track multiple payments for a single invoice
- **Example**: Invoice #001 can have multiple payments (partial payments)

```csharp
// In Facture entity
public ICollection<Paiement> Paiements { get; set; } = new List<Paiement>();

// In Paiement entity
public int FactureId { get; set; }
public Facture Facture { get; set; } = null!;
```

**ModelBuilder Configuration**:
```csharp
modelBuilder.Entity<Paiement>()
	.HasOne(p => p.Facture)
	.WithMany(f => f.Paiements)
	.HasForeignKey(p => p.FactureId);
```

---

### 6. **Contact** (Standalone)
- **Relationship Type**: None
- **Purpose**: Store contact form submissions
- **Standalone**: No foreign keys or relationships with other tables

---

## Complete Data Flow Example

```
SCENARIO: Client Makes a Reservation

1. User logs in
   User (Id=1, NomUtilisateur="johndoe")
		↓
2. User has a Client profile
   Client (Id=1, UserId=1, Nom="Doe", Prenom="John")
		↓
3. Client makes a Reservation
   Reservation (Id=1, ClientId=1, ChambreId=5, DateDebut="2024-01-15", DateFin="2024-01-17")
		↓
4. Reservation generates Invoice
   Facture (Id=1, ReservationId=1, MontantTotal=300, EstPayee=false)
		↓
5. Client makes partial payment
   Paiement (Id=1, FactureId=1, Montant=150, DatePaiement="2024-01-15")
		↓
6. Client makes final payment
   Paiement (Id=2, FactureId=1, Montant=150, DatePaiement="2024-01-16")
		↓
7. Invoice marked as paid
   Facture (Id=1, ReservationId=1, MontantTotal=300, EstPayee=true)
```

---

## Unique Constraints

```sql
-- Client Email must be unique
CREATE UNIQUE INDEX IX_Client_Email ON Clients(Email)

-- User Username must be unique
CREATE UNIQUE INDEX IX_User_NomUtilisateur ON Users(NomUtilisateur)
```

---

## Delete Cascading Rules

| Table | Foreign Key | Delete Behavior | Effect |
|-------|-------------|-----------------|--------|
| Reservation | ClientId | `Restrict` | ❌ Cannot delete Client if it has Reservations |
| Reservation | ChambreId | `Restrict` | ❌ Cannot delete Chambre if it has Reservations |
| Facture | ReservationId | `Cascade` | ✅ Deleting Reservation automatically deletes Facture |
| Paiement | FactureId | Cascade* | ✅ Deleting Facture automatically deletes Paiements |

*Not explicitly set, uses default Cascade behavior

---

## Key Points

✅ **Data Integrity**: 
- Foreign keys prevent orphaned records
- Unique constraints on email and username

✅ **Cascading Deletes**: 
- Reservation → Facture → Paiement (cascade deletes)
- Client/Chambre → Reservation (restrict deletes - safer)

✅ **Relationships**: 
- 5 tables have relationships (User, Client, Chambre, Reservation, Facture, Paiement)
- 1 table is standalone (Contact)

✅ **Query Optimization**: 
- Always use `.Include()` when querying Reservations to avoid N+1 queries
- Example: `context.Reservations.Include(r => r.Client).Include(r => r.Chambre)`
