using EventCentral.API.Models;

namespace backend.Models
{
    public class EventRegistration
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EventId { get; set; }
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public Event? Event { get; set; }
    }

}
