using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using HotelManager.Domain.Entities;
using HotelManager.Domain.Interfaces;

namespace HotelManager.Application.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;

        public ClientService(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        public async Task<IEnumerable<ClientDto>> GetAllClientsAsync()
        {
            var clients = await _clientRepository.GetAllAsync();
            return clients.Select(c => new ClientDto
            {
                Id = c.Id,
                Nom = c.Nom,
                Prenom = c.Prenom,
                Email = c.Email,
                Telephone = c.Telephone,
                Adresse = c.Adresse
            });
        }

        public async Task<ClientDto?> GetClientByIdAsync(int id)
        {
            var client = await _clientRepository.GetByIdAsync(id);
            if (client == null) return null;
            return new ClientDto
            {
                Id = client.Id,
                Nom = client.Nom,
                Prenom = client.Prenom,
                Email = client.Email,
                Telephone = client.Telephone,
                Adresse = client.Adresse
            };
        }

        public async Task<ClientDto> CreateClientAsync(ClientDto clientDto)
        {
            var client = new Client
            {
                Nom = clientDto.Nom,
                Prenom = clientDto.Prenom,
                Email = clientDto.Email,
                Telephone = clientDto.Telephone,
                Adresse = clientDto.Adresse
            };
            var created = await _clientRepository.AddAsync(client);
            clientDto.Id = created.Id;
            return clientDto;
        }

        public async Task UpdateClientAsync(ClientDto clientDto)
        {
            var client = await _clientRepository.GetByIdAsync(clientDto.Id);
            if (client == null) throw new KeyNotFoundException("Client non trouvé");
            client.Nom = clientDto.Nom;
            client.Prenom = clientDto.Prenom;
            client.Email = clientDto.Email;
            client.Telephone = clientDto.Telephone;
            client.Adresse = clientDto.Adresse;
            await _clientRepository.UpdateAsync(client);
        }

        public async Task DeleteClientAsync(int id) => await _clientRepository.DeleteAsync(id);
    }
}