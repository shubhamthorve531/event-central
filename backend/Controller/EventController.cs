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
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventDto>> GetEvent(int id)
        {
            var dto = await _service.GetEventAsync(id);
            if (dto == null) return NotFound();
            return Ok(dto);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<Event>> CreateEvent(Event ev)
        {
            var userIdStr = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            ev.CreatorId = userId;

            var created = await _service.CreateEventAsync(ev);
            return CreatedAtAction(nameof(GetEvent), new { id = created.Id }, created);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, Event ev)
        {
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
