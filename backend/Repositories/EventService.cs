using EventCentral.API.Data;
using EventCentral.API.Models;
using EventCentral.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public class EventService : IEventService
{
    private readonly AppDbContext _context;

    public EventService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EventDto>> GetEventsAsync()
    {
        return await _context.Events
            .Select(e => new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Category = e.Category,
                Date = e.Date,
                Location = e.Location,
                CreatorId = e.CreatorId,
                CreatorName = e.Creator.FullName,
                CreatorEmail = e.Creator.Email,
                RegistrationCount = _context.EventRegistrations.Count(r => r.EventId == e.Id)
            })
            .ToListAsync();
    }

    public async Task<EventDto?> GetEventAsync(int id)
    {
        return await _context.Events
            .Where(e => e.Id == id)
            .Select(e => new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Category = e.Category,
                Date = e.Date,
                Location = e.Location,
                CreatorId = e.CreatorId,
                CreatorName = e.Creator.FullName,
                CreatorEmail = e.Creator.Email,
                RegistrationCount = _context.EventRegistrations.Count(r => r.EventId == e.Id)
            })
            .FirstOrDefaultAsync();
    }

    public async Task<Event> CreateEventAsync(Event ev)
    {
        _context.Events.Add(ev);
        await _context.SaveChangesAsync();
        return ev;
    }

    public async Task<bool> UpdateEventAsync(int id, Event ev)
    {
        if (id != ev.Id) return false;
        _context.Entry(ev).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Events.Any(e => e.Id == id)) return false;
            throw;
        }
    }

    public async Task<bool> DeleteEventAsync(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return false;
        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();
        return true;
    }
}