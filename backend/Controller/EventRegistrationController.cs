
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventCentral.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventRegistrationController : ControllerBase
    {
        private readonly IEventRegistrationService _service;

        public EventRegistrationController(IEventRegistrationService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost("{eventId}")]
        public async Task<IActionResult> Register(int eventId)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _service.RegisterAsync(userId, eventId);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result.Message);
        }

        [Authorize]
        [HttpDelete("{eventId}")]
        public async Task<IActionResult> Unregister(int eventId)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var result = await _service.UnregisterAsync(userId, eventId);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result.Message);
        }

        [Authorize]
        [HttpGet("mine")]
        public async Task<IActionResult> MyRegistrations()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var events = await _service.GetRegisteredEventsAsync(userId);
            return Ok(events);
        }

        [HttpGet("{eventId}/count")]
        public async Task<IActionResult> GetRegistrationCount(int eventId)
        {
            var count = await _service.GetRegistrationCountAsync(eventId);
            return Ok(new { count });
        }
    }
}