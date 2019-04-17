using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeamTracker.Context;
using TeamTracker.Models;

namespace TeamTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly TeamTrackerContext _context;

        public PlayersController(TeamTrackerContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Hits EF InMemoryDatabase, returns list of all Players
        /// </summary>
        /// <returns type="List<Player>">allPlayers</returns>
        // GET: api/Players
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Player>>> GetPlayer()
        {
            return await _context.Player.ToListAsync();
        }

        /// <summary>
        /// Hits EF InMemoryDatabase, searches for specific Player by ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns type="party">Party</returns>
        // GET: api/Players/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Player>> GetPlayer(int id)
        {
            var player = await _context.Player.FindAsync(id);

            if (player == null)
            {
                return NotFound();
            }

            return player;
        }

        /// <summary>
        /// Hits EF InMemoryDatabase, returns all players with a PartyId matching the param id
        /// I chose to write this in the API layer instead of the UI layer grabbing a selected Party
        /// and a list of all Players and creating a new list of Players with the matching PartyID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // GET: api/Players/party/5
        [HttpGet("party/{id}")]
        public async Task<ActionResult<IEnumerable<Player>>> GetPlayersByParty(int id)
        {
            var playerList = await _context.Player.ToListAsync();
            var playerByParty = new List<Player>();

            foreach (var player in playerList)
            {
                if (player.PartyId == id)
                {
                    playerByParty.Add(player);
                }
            }

            if (playerByParty == null)
            {
                return NotFound();
            } 
            else
            {
                return playerByParty;
            }

        }

        /// <summary>
        /// Hits EF InMemoryDatabase, if Player being passed in has an Id of 0, writes new record
        /// If party's id is currently in DB, runs an update
        /// 
        /// This method of PUT over POST for adding a new record was chosen because EF's InMemoryDatabase is not a
        /// relational database, so there were some issues in generating a key for the new item when using a POST
        /// Instead, when writing a new record, the UI hits "api/Players/0", grabs the whole list of Players, and adds an id = to the last records 
        /// Id + 1; this is not ideal for a large application
        /// </summary>
        /// <param name="id"></param>
        /// <param name="party"></param>
        /// <returns type="Party">updatedParty</returns>
        // PUT: api/Players/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlayer(int id, Player player)
        {
            if (id != player.Id)
            {
                return BadRequest();
            }

            if (id == 0)
            {
                var playerList = await _context.Player.ToListAsync();
                player.Id = playerList[playerList.Count -1].Id + 1;
                _context.Player.Add(player);
            }
            else
            {
                _context.Entry(player).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlayerExists(id))
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

        /// <summary>
        /// Adds record to EF InMemoryDatabase
        /// This is not used by the UI, instead uses PUT to write new records
        /// </summary>
        /// <param name="party"></param>
        /// <returns></returns>
        // POST: api/Players
        [HttpPost]
        public async Task<ActionResult<Player>> PostPlayer(Player player)
        {
            var playerList = await _context.Player.ToListAsync();
            player.Id = playerList[-1].Id + 1;
            _context.Player.Add(player);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPlayer", new { id = player.Id }, player);
        }

        /// <summary>
        /// Deletes record from EF InMemoryDatabase with id matching the param id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // DELETE: api/Players/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Player>> DeletePlayer(int id)
        {
            var player = await _context.Player.FindAsync(id);
            if (player == null)
            {
                return NotFound();
            }

            _context.Player.Remove(player);
            await _context.SaveChangesAsync();

            return player;
        }

        /// <summary>
        /// Looks through list of all Player records, 
        /// if the param id exists in the list, return true
        /// else return false
        /// </summary>
        /// <param name="id"></param>
        /// <returns type="boolean"></returns>
        private bool PlayerExists(int id)
        {
            return _context.Player.Any(e => e.Id == id);
        }
    }
}
