using EventCentral.API.Models;

public interface IEventService
{
    Task<IEnumerable<EventDto>> GetEventsAsync();
    Task<EventDto?> GetEventAsync(int id);
    Task<Event> CreateEventAsync(Event ev);
    Task<bool> UpdateEventAsync(int id, Event ev);
    Task<bool> DeleteEventAsync(int id);
}