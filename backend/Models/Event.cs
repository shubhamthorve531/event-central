using backend.Models;

namespace EventCentral.API.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Location { get; set; } = string.Empty;

        // Foreign key to User
        public int CreatorId { get; set; }
        public User? Creator { get; set; }
    }
}
