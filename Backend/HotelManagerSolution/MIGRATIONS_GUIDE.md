# Entity Framework Migrations Guide - HotelManager

## Issue Fixed
The `dotnet ef migrations add InitialCreate` command was failing because:
- ❌ **Missing Package**: `HotelManager.Infrastructure` was missing `Microsoft.EntityFrameworkCore.Tools`
- ❌ **Missing Package**: `HotelManager.Infrastructure` was missing `Microsoft.EntityFrameworkCore.SqlServer`

## Solution Applied
Updated `HotelManager.Infrastructure.csproj` with required packages:

```xml
<ItemGroup>
	<PackageReference Include="Microsoft.EntityFrameworkCore" Version="10.0.6" />
	<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.6" />
	<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="10.0.6" />
</ItemGroup>
```

---

## How to Create Migrations

### Step 1: Open Package Manager Console
In Visual Studio:
- **Tools** → **NuGet Package Manager** → **Package Manager Console**

### Step 2: Set the Infrastructure Project as Startup Project
In Package Manager Console, make sure the **Default project** is set to: `HotelManager.Infrastructure`

Or run the commands from the Infrastructure directory:
```powershell
cd HotelManager.Infrastructure
```

### Step 3: Create Initial Migration
```powershell
dotnet ef migrations add InitialCreate --project HotelManager.Infrastructure --startup-project HotelManager.API
```

**Alternative (simpler):**
```powershell
dotnet ef migrations add InitialCreate
```

### Step 4: Update Database
This command creates/updates the actual SQL Server database:
```powershell
dotnet ef database update --project HotelManager.Infrastructure --startup-project HotelManager.API
```

**Alternative:**
```powershell
dotnet ef database update
```

### Step 5: Verify Migration
After running `dotnet ef database update`, check your SQL Server database (using SQL Server Management Studio):
- Connect to: `Server=SOFIANELAP\SQLEXPRESS;Database=HotelManagerDB`
- You should see 7 tables created:
  - `Clients`
  - `Chambres`
  - `Reservations`
  - `Factures`
  - `Paiements`
  - `Users`
  - `Contacts`

---

## Project Structure

```
HotelManagerSolution/
├── HotelManager.Domain/
│   ├── Entities/
│   │   ├── User.cs
│   │   ├── Client.cs
│   │   ├── Chambre.cs
│   │   ├── Reservation.cs
│   │   ├── Facture.cs
│   │   ├── Paiement.cs
│   │   └── Contact.cs
│   └── Interfaces/
│       └── (Repository interfaces)
│
├── HotelManager.Infrastructure/
│   ├── Data/
│   │   └── AppDbContext.cs ◄── DbContext (handles migrations)
│   ├── Repositories/
│   │   └── (Repository implementations)
│   └── HotelManager.Infrastructure.csproj ◄── Has EF packages
│
├── HotelManager.Application/
│   ├── Services/
│   └── DTOs/
│
├── HotelManager.API/
│   ├── Program.cs ◄── Startup project (for connection string)
│   └── appsettings.json ◄── Database connection string
│
└── HotelManagerSolution.sln
```

---

## Important: Connection String Location

Your connection string is stored in:
```
HotelManager.API/appsettings.json
```

```json
{
  "ConnectionStrings": {
	"DefaultConnection": "Server=SOFIANELAP\\SQLEXPRESS;Database=HotelManagerDB;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True"
  }
}
```

**Make sure:**
- ✅ SQL Server instance is running: `SOFIANELAP\SQLEXPRESS`
- ✅ Database `HotelManagerDB` exists (or will be created)
- ✅ You have permissions to create tables

---

## Troubleshooting

### Issue 1: "Could not load type 'Microsoft.EntityFrameworkCore.Design.DesignTimeDbContextFactory'"
**Solution:**
- Rebuild the solution: `dotnet build`
- Close and reopen Visual Studio

### Issue 2: "Cannot find DbContext in the project"
**Solution:**
- Ensure `AppDbContext.cs` is in `HotelManager.Infrastructure/Data/`
- Make sure the class inherits from `DbContext`

### Issue 3: "The entity type 'X' requires a primary key"
**Solution:**
- Add `public int Id { get; set; }` to the entity class
- All entities must have a primary key

### Issue 4: "Build failed" when running migration command
**Solution:**
- Run `dotnet build` first to check for compilation errors
- Fix all compilation errors before creating migrations

### Issue 5: "Connection string not found"
**Solution:**
- Verify `appsettings.json` exists in `HotelManager.API`
- Verify the connection string key is `DefaultConnection`
- Restart Visual Studio after changing connection string

---

## Migration Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Modify Entity Classes in HotelManager.Domain/Entities/   │
│    (add properties, relationships, etc.)                    │
└────────────────┬────────────────────────────────────────────┘
				 │
┌────────────────▼────────────────────────────────────────────┐
│ 2. Build Solution                                           │
│    dotnet build                                             │
└────────────────┬────────────────────────────────────────────┘
				 │
┌────────────────▼────────────────────────────────────────────┐
│ 3. Create Migration                                         │
│    dotnet ef migrations add DescriptiveNameHere            │
│    (Creates: Migrations/YYYYMMDDHHMMSS_DescriptiveNameHere │
└────────────────┬────────────────────────────────────────────┘
				 │
┌────────────────▼────────────────────────────────────────────┐
│ 4. Review Migration File (optional)                         │
│    Check Migrations/YYYYMMDDHHMMSS_DescriptiveNameHere.cs   │
└────────────────┬────────────────────────────────────────────┘
				 │
┌────────────────▼────────────────────────────────────────────┐
│ 5. Update Database                                          │
│    dotnet ef database update                                │
└────────────────┬────────────────────────────────────────────┘
				 │
┌────────────────▼────────────────────────────────────────────┐
│ 6. Verify in SQL Server Management Studio                   │
│    Connect to SOFIANELAP\SQLEXPRESS, check tables           │
└─────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Run migration command** in Package Manager Console:
   ```powershell
   dotnet ef migrations add InitialCreate
   ```

2. **Update the database**:
   ```powershell
   dotnet ef database update
   ```

3. **Verify tables were created** in SQL Server

4. **Start the API** to test endpoints

---

## Common Migration Commands

| Command | Purpose |
|---------|---------|
| `dotnet ef migrations add <Name>` | Create a new migration |
| `dotnet ef database update` | Apply pending migrations to DB |
| `dotnet ef database update <Migration>` | Revert to specific migration |
| `dotnet ef migrations remove` | Remove last migration (before pushing) |
| `dotnet ef migrations list` | Show all migrations |
| `dotnet ef migrations script` | Generate SQL migration script |

---

## Files Modified

✅ **HotelManager.Infrastructure/HotelManager.Infrastructure.csproj**
- Added `Microsoft.EntityFrameworkCore.SqlServer` package
- Added `Microsoft.EntityFrameworkCore.Tools` package

These packages enable:
- SQL Server as database provider
- EF CLI tools (migrations, database update commands)

