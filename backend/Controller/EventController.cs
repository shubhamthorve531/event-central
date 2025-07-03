using EventCentral.API.Models;
using EventCentral.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventCentral.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _service;

        public EventController(IEventService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents()
        {
            var events = await _service.GetEventsAsync();
            var result = events.Select(e => new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Category = e.Category,
                Date = e.Date,
                Location = e.Location,
                CreatorId = e.CreatorId,
                CreatorName = e.Creator?.FullName ?? "",
                CreatorEmail = e.Creator?.Email ?? ""
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventDto>> GetEvent(int id)
        {
            var e = await _service.GetEventAsync(id);
            if (e == null) return NotFound();
            var dto = new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Category = e.Category,
                Date = e.Date,
                Location = e.Location,
                CreatorId = e.CreatorId,
                CreatorName = e.Creator?.FullName ?? "",
                CreatorEmail = e.Creator?.Email ?? ""
            };
            return Ok(dto);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<EventDto>> CreateEvent(EventDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            // Map DTO to Entity
            var ev = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Date = dto.Date,
                Location = dto.Location,
                CreatorId = userId
            };

            var created = await _service.CreateEventAsync(ev);

            // Map Entity to DTO for response
            var result = new EventDto
            {
                Id = created.Id,
                Title = created.Title,
                Description = created.Description,
                Category = created.Category,
                Date = created.Date,
                Location = created.Location,
                CreatorId = created.CreatorId,
                CreatorName = created.Creator?.FullName ?? "",
                CreatorEmail = created.Creator?.Email ?? ""
            };

            return CreatedAtAction(nameof(GetEvent), new { id = result.Id }, result);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, EventDto dto)
        {
            // Map DTO to Entity
            var ev = new Event
            {
                Id = id,
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Date = dto.Date,
                Location = dto.Location,
                CreatorId = dto.CreatorId // You may want to keep this as is or set from claims
            };

            var success = await _service.UpdateEventAsync(id, ev);
            if (!success) return BadRequest();
            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var success = await _service.DeleteEventAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }   
}
