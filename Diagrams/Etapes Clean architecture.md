**1 - Create a blank solution (ex : Client)**



**2 - Add Layers to the the Solution the layers are :**

&#x20;     - Client.Domain (Entities + Interfaces) -> type : Class Library

&#x20;     - Client.Application (Services) -> type : Class Library

&#x20;     - Client.Infrastructure (Data + Repositories) -> type : Class Library

&#x20;     - Client.API (Controllers) -> type : ASP.NET Core



The most important thing in Clean Architecture is dependencies between layers :



**API**

&#x20; **↓**

**Application**

&#x20; **↓**

**Domain**

&#x20; **↑**

**Infrastructure**



**✔ API → Application**

**✔ Application → Domain**

**✔ Infrastructure → Domain**



**❌ Domain must not depend on anything**





**3 - What is the Content of each Layer :**



**3-1 Client.Domain : This layer contains core business objects and contracts (interfaces).**



Client.Domain

│

├── Entities

│     └── Client.cs

│

├── Interfaces

│     └── IClientRepository.cs



**Example : Client.cs**



namespace Client.Domain.Entities

{

&#x20;   public class Client

&#x20;   {

&#x20;       public int Id { get; set; }

&#x20;       public string Nom { get; set; }

&#x20;       public string Prenom { get; set; }

&#x20;       public string Email { get; set; }

&#x20;       public string Password { get; set; }

&#x20;   }

}



**Example : IClientRepository.cs**



namespace Client.Domain.Interfaces

{

&#x20;   public interface IClientRepository

&#x20;   {

&#x20;       Task<List<Client>> GetClientsAsync();

&#x20;       Task<Client> GetClientByIdAsync(int id);

&#x20;       Task<Client> CreateAsync(Client client);

&#x20;       Task<int> UpdateAsync(int id, Client client);

&#x20;       Task<int> DeleteAsync(int id);

&#x20;   }

}



**3-2 Client.Application : This layer contains services and business logic.**



Client.Application

│

├── Services

│     ├── IClientService.cs

│     └── ClientService.cs



**Example : IClientService.cs**



namespace Blog.Application.Services

{

&#x20;   public interface IClientServices

&#x20;   {

&#x20;       Task<List<Client>> GetClientsAsync();

&#x20;       Task<Client> GetClientByIdAsync(int id);

&#x20;       Task<Client> CreateAsync(Client client);

&#x20;       Task<int> UpdateAsync(int id, Client client);

&#x20;       Task<int> DeleteAsync(int id);

&#x20;   }

}



**Example : ClientService.cs (Here implement the ClientService)**



namespace Client.Application.Services

{

&#x20;   public class ClientServices : IClientServices

&#x20;   {

&#x20;       private readonly IClientRepository \_clientRepository;

&#x20;       public ClientServices(IClientRepository clientRepository)

&#x20;       {

&#x20;           \_clientRepository = clientRepository;



&#x20;       }

&#x20;       public async Task<Client> CreateAsync(Client client)

&#x20;       {

&#x20;           return await \_clientRepository.CreateAsync(client);

&#x20;       }



&#x20;       public async Task<int> DeleteAsync(int id)

&#x20;       {

&#x20;           return await \_clientRepository.DeleteAsync(id);

&#x20;       }



&#x20;       public async Task<Client> GetClientByIdAsync(int id)

&#x20;       {

&#x20;           return await \_clientRepository.GetClientByIdAsync(id);

&#x20;       }



&#x20;       public async Task<List<Client>> GetClientsAsync()

&#x20;       {

&#x20;           return await \_clientRepository.GetClientsAsync();

&#x20;       }



&#x20;       public async Task<int> UpdateAsync(int id, Client client)

&#x20;       {

&#x20;           return await \_clientRepository.UpdateAsync(id, client);

&#x20;       }

&#x20;   }

}



**3-4 Client.Infrastructure : This layer handles database and data access and It implements Domain interfaces.**



Client.Infrastructure

│

├── Data

│     └── ApplicationDbContext.cs

│

├── Repositories

│     └── ClientRepository.cs



**Example : ApplicationDbContext.cs**



namespace Client.Infrastructure.Data

{

&#x20;   public class ClientDbContext : DbContext

&#x20;   {

&#x20;       public ClientDbContext(DbContextOptions<ClientDbContext> options) : base(options) { }

&#x20;            public DbSet<Client> clients { get; set; }

&#x20;       

&#x20;   }

}



**Example : ClientRepository.cs**



namespace Client.Infrastructure.Repositories

{

&#x20;   public class ClientRepository : IClientRepository

&#x20;   {

&#x20;       private readonly ClientDbContext \_clientDbContext;



&#x20;       public ClientRepository(ClientDbContext clientDbContext)

&#x20;       {

&#x20;           \_clientDbContext = clientDbContext;

&#x20;       }



&#x20;       public async Task<Client> CreateAsync(Client client)

&#x20;       {

&#x20;           await \_clientDbContext.clients.AddAsync(client);

&#x20;           await \_clientDbContext.SaveChangesAsync();

&#x20;           return client;

&#x20;       }



&#x20;       public async Task<int> DeleteAsync(int id)

&#x20;       {

&#x20;           var client = await \_clientDbContext.clients.FindAsync(id);

&#x20;           if (client != null)

&#x20;           {

&#x20;               \_clientDbContext.clients.Remove(client);

&#x20;               await \_clientDbContext.SaveChangesAsync();

&#x20;               return 1;

&#x20;           }

&#x20;           return 0;

&#x20;       }



&#x20;       public async Task<Client> GetClientByIdAsync(int id)

&#x20;       {

&#x20;           var client =  await \_clientDbContext.clients.FindAsync(id);

&#x20;           return client;

&#x20;       }



&#x20;       public async Task<List<Client>> GetClientsAsync()

&#x20;       {

&#x20;           return await \_clientDbContext.clients.ToListAsync();

&#x20;       }



&#x20;       public Task<int> UpdateAsync(int id, Client client)

&#x20;       {

&#x20;           return Task.Run(() =>

&#x20;           {

&#x20;               var existingClient = \_clientDbContext.clients.Find(id);

&#x20;               if (existingClient != null)

&#x20;               {

&#x20;                   existingClient.Nom = client.Nom;

&#x20;                   existingClient.Prenom = client.Prenom;

&#x20;                   existingClient.Age = client.Age;

&#x20;                   existingClient.Job = client.Job;

&#x20;                   \_clientDbContext.SaveChanges();

&#x20;                   return 1;

&#x20;               }

&#x20;               return 0;

&#x20;           });

&#x20;       }

&#x20;   }

}



**3-4 Client.API**



Client.API

│

├── Controllers

│     └── ClientController.cs

│

├── Program.cs



**Example : ClientController.cs**



namespace Client.API.Controllers

{

&#x20;   \[ApiController]

&#x20;   \[Route("api/\[controller]")]

&#x20;   public class ClientController : ControllerBase

&#x20;   {

&#x20;       private readonly IClientService \_service;



&#x20;       public ClientController(IClientService service)

&#x20;       {

&#x20;           \_service = service;

&#x20;       }



&#x20;       \[HttpGet]

&#x20;       public async Task<IActionResult> GetClients()

&#x20;       {

&#x20;           var clients = await \_service.GetClients();

&#x20;           return Ok(clients);

&#x20;       }



&#x20;       \[HttpPost]

&#x20;       public async Task<IActionResult> AddClient(Client client)

&#x20;       {

&#x20;           await \_service.AddClient(client);

&#x20;           return Ok();

&#x20;       }

&#x20;   }

}



**Example : Program.cs**



var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();



var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");



builder.Services.AddDbContext<ClientDbContext>(options =>

&#x20;   options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))

);



builder.Services.AddScoped<IClientServices, ClientServices>();

builder.Services.AddScoped<IClientRepository, ClientRepository>();



var app = builder.Build();



if (app.Environment.IsDevelopment())

{

&#x20;   app.UseSwagger();

&#x20;   app.UseSwaggerUI();

}



app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();



app.Run();





And in appsettings.json this database connection :



&#x20;{

&#x20; "ConnectionStrings": {

&#x20;   "DefaultConnection": "server=localhost;database=users;user=root;password="

&#x20; },



&#x20; "Logging": {

&#x20;   "LogLevel": {

&#x20;     "Default": "Information",

&#x20;     "Microsoft.AspNetCore": "Warning"

&#x20;   }

&#x20; },



&#x20; "AllowedHosts": "\*"

}







