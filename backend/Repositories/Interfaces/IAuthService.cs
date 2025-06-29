using backend.Models;

namespace EventCentral.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string?> LoginAsync(string email, string password);
        Task<bool> RegisterAsync(string fullName,string email, string password);
    }
}
