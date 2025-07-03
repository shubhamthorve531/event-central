using backend.Models;
using EventCentral.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EventCentral.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Event> Events { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<EventRegistration> EventRegistrations { get; set; }

    }
}
