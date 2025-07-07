using backend.DTOs;
using backend.Models;

namespace EventCentral.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResultDto?> LoginAsync(string email, string password);
        Task<bool> RegisterAsync(string fullName,string email, string password);
    }
}
