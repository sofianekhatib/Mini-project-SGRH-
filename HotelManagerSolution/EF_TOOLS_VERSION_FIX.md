# EF Tools Version Fix - Complete Guide

## ✅ Problem Fixed

### What Was Wrong
```
The Entity Framework tools version '10.0.5' is older than that of the runtime '10.0.6'.
System.MissingMethodException: Method not found: 'System.String Microsoft.EntityFrameworkCore.Diagnostics.AbstractionsStrings.ArgumentIsEmpty(System.Object)'.
```

### Root Cause
**Version Mismatch:**
- ❌ Global EF Tools: 10.0.5 (OUTDATED)
- ✅ Project Runtime: 10.0.6 (CURRENT)
- ✅ Project EF Packages: 10.0.6-10.0.8 (CURRENT)

The older tools couldn't communicate with the newer runtime.

### Solutions Applied

#### 1. Updated Global EF Tools
```powershell
# Before: 10.0.5
dotnet tool update -g dotnet-ef

# After: 10.0.8 ✅
```

#### 2. Updated Package Versions
- `HotelManager.API`:
  - ✅ Updated `Microsoft.AspNetCore.OpenApi` from 10.0.5 → 10.0.6
  - ✅ Already had correct `Microsoft.EntityFrameworkCore.Design` 10.0.8
  - ✅ Already had correct `Microsoft.EntityFrameworkCore.Tools` 10.0.8

- `HotelManager.Infrastructure`:
  - ✅ Already had correct packages (added previously)

---

## 🚀 Next Steps - Create Migration

### Method 1: Package Manager Console (RECOMMENDED)

1. **Open Visual Studio**

2. **Open Package Manager Console**
   - Menu: **Tools** → **NuGet Package Manager** → **Package Manager Console**

3. **Set Default Project to Infrastructure**
   - In the dropdown at top of Package Manager Console
   - Select: `HotelManager.Infrastructure`

4. **Run this command:**
   ```powershell
   Add-Migration InitialCreate
   ```

   **Wait for completion** (takes 30-60 seconds)

5. **Update Database:**
   ```powershell
   Update-Database
   ```

### Method 2: Command Line (Alternative)

From the solution root directory:
```powershell
dotnet ef migrations add InitialCreate --project HotelManager.Infrastructure --startup-project HotelManager.API
```

Then:
```powershell
dotnet ef database update --project HotelManager.Infrastructure --startup-project HotelManager.API
```

---

## ✅ Verify It Worked

### In SQL Server Management Studio:
1. Connect to: `SOFIANELAP\SQLEXPRESS`
2. Find database: `HotelManagerDB`
3. Expand **Tables** folder
4. Should see **7 tables**:
   - `dbo.Clients`
   - `dbo.Chambres`
   - `dbo.Reservations`
   - `dbo.Factures`
   - `dbo.Paiements`
   - `dbo.Users`
   - `dbo.Contacts`
   - `dbo.__EFMigrationsHistory` (tracks applied migrations)

### In Visual Studio:
1. Check `HotelManager.Infrastructure/Migrations/` folder
2. Should contain files like:
   - `20231215123456_InitialCreate.cs` (migration up)
   - `20231215123456_InitialCreate.Designer.cs` (migration metadata)

---

## 📋 What Was Changed

### Files Modified:

1. **HotelManager.Infrastructure/HotelManager.Infrastructure.csproj**
   ```xml
   <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.6" />
   <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="10.0.6" />
   ```

2. **HotelManager.API/HotelManager.API.csproj**
   ```xml
   <!-- Updated OpenApi version -->
   <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="10.0.6" />

   <!-- Already had correct Tools version -->
   <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="10.0.8" />
   ```

### Global Tools Updated:
```powershell
dotnet-ef: 10.0.5 → 10.0.8
```

---

## ⚠️ Troubleshooting

### Error: "Cannot find a DbContext in the project"
**Solution:**
- Ensure `AppDbContext` is in `HotelManager.Infrastructure/Data/`
- Rebuild solution: `dotnet build`

### Error: "Cannot open database"
**Solution:**
- Check SQL Server is running
- Verify connection string in `HotelManager.API/appsettings.json`
- Instance: `SOFIANELAP\SQLEXPRESS`

### Error: "One or more validation errors"
**Solution:**
- Check all entity classes have `public int Id { get; set; }`
- Check all foreign keys are defined correctly
- Rebuild solution: `dotnet build`

### Error: "There is already an object named '...' in the database"
**Solution:**
- Database already exists from previous attempt
- Option A: Delete `HotelManagerDB` from SQL Server and re-run migration
- Option B: Create a new database name and update connection string

---

## 🎯 Current Status

✅ **EF Tools**: Updated to 10.0.8  
✅ **Package Versions**: All aligned (10.0.6-10.0.8)  
✅ **Build Status**: Successful  
✅ **Ready to Migrate**: YES  

**Next Action:** Run migration commands in Package Manager Console

---

## 📚 Reference

### All Package Versions Now:
```
HotelManager.API:
  - Microsoft.AspNetCore.Authentication.JwtBearer: 10.0.6
  - Microsoft.AspNetCore.OpenApi: 10.0.6
  - Microsoft.EntityFrameworkCore.Design: 10.0.8
  - Microsoft.EntityFrameworkCore.SqlServer: 10.0.6
  - Microsoft.EntityFrameworkCore.Tools: 10.0.8
  - Swashbuckle.AspNetCore: 10.1.7

HotelManager.Infrastructure:
  - Microsoft.EntityFrameworkCore: 10.0.6
  - Microsoft.EntityFrameworkCore.SqlServer: 10.0.6
  - Microsoft.EntityFrameworkCore.Tools: 10.0.6

HotelManager.Application:
  - (Uses services and DTOs, no direct EF packages)

HotelManager.Domain:
  - (Contains only entities and interfaces, no packages)

Global Tools:
  - dotnet-ef: 10.0.8
```

