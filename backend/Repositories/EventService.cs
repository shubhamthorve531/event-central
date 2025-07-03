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

    public async Task<IEnumerable<Event>> GetEventsAsync()
        => await _context.Events
            .Include(e => e.Creator)
            .ToListAsync();

    public async Task<Event?> GetEventAsync(int id)
        => await _context.Events
            .Include(e => e.Creator)
            .FirstOrDefaultAsync(e => e.Id == id);

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