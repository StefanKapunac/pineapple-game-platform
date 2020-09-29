using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RoomService.Data;
using RoomService.Hubs;
using RoomService.Hubs.Clients;
using RoomService.Models;

namespace RoomService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomRequestsController : ControllerBase
    {

        private readonly IHubContext<RoomHub, IRoomHubClient> _roomHub;


        private readonly Dictionary<string, string> _participantToGroup = new Dictionary<string, string>();

        private readonly RoomServiceContext _context;

        public RoomRequestsController(RoomServiceContext context, IHubContext<RoomHub, IRoomHubClient> roomHub)
        {
            _context = context;
            _roomHub = roomHub;
        }

        // GET: api/RoomRequests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
        {
            return await _context.Rooms.Include(r => r.Participants).ToListAsync();
        }

        // GET: api/RoomRequests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            //var room = await _context.Rooms.FindAsync(id);
            var room = await _context.Rooms.Include(r => r.Participants).Where(r => r.Id == id).FirstOrDefaultAsync();

            if (room == null)
            {
                return NotFound();
            }

            return room;
        }

        // PUT: api/RoomRequests/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoomRequest(int id, RoomRequest roomRequest)
        {
            if (id != roomRequest.RoomId)
            {
                return BadRequest();
            }

            //_context.Entry(roomRequest).State = EntityState.Modified;

            Room room = await _context.Rooms.Include(r => r.Participants).Where(r => r.Id == id).FirstOrDefaultAsync();
            if (room == null)
            {
                return NotFound();
            }
            if(room.GameId != roomRequest.GameId)
            {
                return BadRequest("Wrong game id");
            }
            bool result = room.Participants.Add(roomRequest.Participant);
            if(result == false)
            {
                return NoContent();
            }
            _context.Rooms.Update(room);
            _context.Participants.Add(roomRequest.Participant);

            _participantToGroup.Add(roomRequest.Participant.Name, id.ToString());


            // ako je puna soba - pokreni igricu
            int maxParticipants = Room.games.Where(g => g.Id == room.GameId).Select(g => g.NumPlayers).FirstOrDefault();
            if (room.Participants.Count() == maxParticipants)
            {
                Console.WriteLine("puna soba");

                _context.Rooms.Remove(room);
                await _context.SaveChangesAsync();

                // send signal to frontend
                await _roomHub.Clients.All.FullRoom(room);
            }
            else
            {
                Console.WriteLine("room updated");
                await _roomHub.Clients.All.RoomUpdated(room);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/RoomRequests
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoomRequest(RoomRequest roomRequest)
        {
            //Room room = new Room(roomRequest.GameId, new HashSet<Participant> { roomRequest.Participant });
            Participant p = new Participant {
                Id = roomRequest.Participant.Id,
                Name = roomRequest.Participant.Name
            };
            _context.Participants.Add(p);

            Room room = new Room {
                Participants = new HashSet<Participant> { p }
            };
            if (!Room.games.Any(g => g.Id == roomRequest.GameId))
            {
                return BadRequest("There is no game with the requested id");
            }
            room.GameId = roomRequest.GameId;
            _context.Rooms.Add(room);
            
            _participantToGroup.Add(roomRequest.Participant.Name, room.Id.ToString());

            await _context.SaveChangesAsync();

            await _roomHub.Clients.All.RoomMade(room);

            //Room r = _context.Rooms.Find(room.Id);


            return CreatedAtAction("GetRoom", new { id = room.Id }, room);
        }

        // DELETE: api/RoomRequests/5
        [HttpDelete("{id}")]
        public async Task DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return;
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}
