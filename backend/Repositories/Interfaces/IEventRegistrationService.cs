using EventCentral.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEventRegistrationService
{
    Task<(bool Success, string Message)> RegisterAsync(int userId, int eventId);
    Task<(bool Success, string Message)> UnregisterAsync(int userId, int eventId);
    Task<IEnumerable<Event>> GetRegisteredEventsAsync(int userId);
    Task<int> GetRegistrationCountAsync(int eventId);
}