# 🏨 HotelManager – Application de Gestion Hôtelière

## 📌 Présentation

**HotelManager** est une application complète de gestion hôtelière développée avec **ASP.NET Core** pour le backend et **React.js** pour le frontend.

L’application permet de gérer :

* 🛏️ Les chambres
* 👥 Les clients
* 📅 Les réservations
* 🧾 Les factures
* 👨‍💼 Les utilisateurs (Administrateurs, Réceptionnistes, Clients)

---

# 🧱 Architecture

## 🔹 Backend

* ASP.NET Core (.NET 8)
* API REST
* Entity Framework Core
* Authentification JWT

## 🔹 Frontend

* React 18
* Tailwind CSS
* React Router

## 🔹 Base de données

* SQL Server
* Migrations EF Core

---

# 📂 Structure de la Solution

```bash
HotelManagerSolution/
├── HotelManager.API              # Contrôleurs, Swagger, configuration
├── HotelManager.Application      # Services, DTOs, interfaces métier
├── HotelManager.Domain           # Entités, enums, interfaces repositories
└── HotelManager.Infrastructure   # DbContext, migrations, repositories

hotelmanager/                     # Frontend React
```

---

# 🚀 Installation et Lancement

## 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/sofianekhatib/Mini-project-SGRH-.git
cd Mini-project-SGRH-
```

---

## 2️⃣ Restaurer les packages NuGet

Dans la racine de la solution (`.sln`) :

```bash
dotnet restore
```

---

## 3️⃣ Configurer la chaîne de connexion

Modifier le fichier :

```bash
HotelManager.API/appsettings.json
```

Ajouter ou modifier :

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HotelDataBase;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

⚠️ Si vous utilisez un autre serveur SQL (`SQLEXPRESS`, `localhost`, etc.), adaptez la chaîne de connexion.

---

## 4️⃣ Créer la base de données

```bash
cd HotelManager.API
dotnet ef database update
```

Cette commande crée automatiquement toutes les tables :

* Chambres
* Clients
* Réservations
* Factures
* Paiements
* Utilisateurs

---

## 5️⃣ Ajouter des données de démonstration (Optionnel)

### 👑 Créer un administrateur

Ouvrir le terminal intégré dans **Visual Studio Code** :

* `Terminal → New Terminal`
* Ou raccourci : `Ctrl + ``

Exécuter la commande PowerShell suivante :

```powershell
$body = @{
    username = "admin_final"
    password = "admin123"
    email = "admin_final@hotel.com"
    role = "Admin"
    nom = ""
    prenom = ""
    telephone = ""
    adresse = ""
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "https://localhost:7188/api/Auth/register" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

✅ Résultat attendu : `Utilisateur créé`

---

### 🛏️ Ajouter des chambres

```sql
INSERT INTO Chambres (Numero, Type, PrixParNuit, Statut, Description)
VALUES 
('101', 'Simple', 80.00, 0, 'Chambre simple avec vue sur jardin'),
('102', 'Double', 120.00, 0, 'Chambre double confort'),
('103', 'Suite', 250.00, 0, 'Suite familiale avec salon'),
('104', 'Deluxe', 180.00, 0, 'Chambre deluxe avec balcon'),
('105', 'Simple', 75.00, 2, 'Chambre simple côté cour (en nettoyage)');
```

---

## 6️⃣ Lancer le Backend

```bash
cd HotelManager.API
dotnet run
```

### 🔗 URLs importantes

* API : `https://localhost:7188`
* Swagger : `https://localhost:7188/swagger`

⚠️ Le frontend utilise le port `7188`.

Si le backend tourne sur un autre port, modifiez les URLs dans les fichiers `.jsx`.

---

## 7️⃣ Lancer le Frontend

Ouvrir un nouveau terminal :

```bash
cd hotelmanager
npm install
npm start
```

Application disponible sur :

```bash
http://localhost:3000
```

---

# 🔐 Comptes par Défaut

## 👑 Administrateur

| Nom d'utilisateur | Mot de passe |
| ----------------- | ------------ |
| admin_final       | Admin123     |

---

## 🧑‍💼 Réceptionniste

1. Connectez-vous comme administrateur
2. Aller dans **Gestion des utilisateurs**
3. Cliquer sur **Nouvel utilisateur**
4. Choisir le rôle **Réceptionniste**

---

## 👤 Client

1. Cliquer sur **S’inscrire**
2. Remplir le formulaire
3. Se connecter avec les identifiants créés

---

# 📦 Packages NuGet

## ✅ HotelManager.API

* BCrypt.Net-Next `4.2.0`
* Microsoft.AspNetCore.Authentication.JwtBearer `10.0.6`
* Microsoft.AspNetCore.OpenApi `10.0.6`
* Microsoft.EntityFrameworkCore.Design `10.0.8`
* Microsoft.EntityFrameworkCore.SqlServer `10.0.6`
* Microsoft.EntityFrameworkCore.Tools `10.0.8`
* Swashbuckle.AspNetCore `10.1.7`

---

## ✅ HotelManager.Application

* BCrypt.Net-Next `4.2.0`
* Microsoft.Extensions.Configuration.Abstractions `10.0.6`
* Microsoft.IdentityModel.Tokens `8.17.0`
* Portable.BouncyCastle `1.9.0`
* System.IdentityModel.Tokens.Jwt `8.17.0`

---

## ✅ HotelManager.Domain

Aucun package externe.

---

## ✅ HotelManager.Infrastructure

* Microsoft.EntityFrameworkCore `10.0.6`
* Microsoft.EntityFrameworkCore.SqlServer `10.0.6`
* Microsoft.EntityFrameworkCore.Tools `10.0.6`

---

# ⚙️ Configuration JWT

Dans `appsettings.json` :

```json
"Jwt": {
  "Key": "votre_clé_secrète_très_longue_32_caractères_ou_plus"
}
```

⚠️ La clé JWT doit contenir au minimum **32 caractères**.

---

# ✨ Fonctionnalités Principales

* 🔐 Authentification JWT
* 👥 Gestion des utilisateurs
* 🛏️ Gestion des chambres
* 📅 Gestion des réservations
* 🧾 Génération des factures
* 💳 Gestion des paiements
* 📊 Tableau de bord administrateur
* 🌐 API REST documentée avec Swagger

---

# 📄 Licence

Ce projet est destiné à un usage éducatif et académique.

---

# 👨‍💻 Auteur

Développé par **Sofiane Khatib**.
