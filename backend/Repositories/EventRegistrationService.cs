using backend.Models;
using EventCentral.API.Data;
using EventCentral.API.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class EventRegistrationService : IEventRegistrationService
    {
        private readonly AppDbContext _context;

        public EventRegistrationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message)> RegisterAsync(int userId, int eventId)
        {
            if (await _context.EventRegistrations.AnyAsync(r => r.UserId == userId && r.EventId == eventId))
                return (false, "Already registered");

            if (!await _context.Events.AnyAsync(e => e.Id == eventId))
                return (false, "Event does not exist");

            var registration = new EventRegistration
            {
                UserId = userId,
                EventId = eventId
            };

            _context.EventRegistrations.Add(registration);
            await _context.SaveChangesAsync();

            return (true, "Registered successfully");
        }

        public async Task<(bool Success, string Message)> UnregisterAsync(int userId, int eventId)
        {
            var registration = await _context.EventRegistrations
                .FirstOrDefaultAsync(r => r.UserId == userId && r.EventId == eventId);

            if (registration == null)
                return (false, "Registration not found");

            _context.EventRegistrations.Remove(registration);
            await _context.SaveChangesAsync();

            return (true, "Unregistered successfully");
        }

        public async Task<IEnumerable<Event>> GetRegisteredEventsAsync(int userId)
        {
            return await _context.EventRegistrations
                .Where(r => r.UserId == userId)
                .Include(r => r.Event)
                .Select(r => r.Event)
                .ToListAsync();
        }

        public async Task<int> GetRegistrationCountAsync(int eventId)
        {
            return await _context.EventRegistrations
                .CountAsync(r => r.EventId == eventId);
        }
    }
}