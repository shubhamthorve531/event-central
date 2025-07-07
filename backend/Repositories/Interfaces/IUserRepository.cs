using backend.Models;

namespace EventCentral.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<bool> ExistsAsync(string email);
        Task AddUserAsync(User user);
    }
}
