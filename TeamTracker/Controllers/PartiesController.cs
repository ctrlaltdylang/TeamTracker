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
    public class PartiesController : ControllerBase
    {
        private readonly TeamTrackerContext _context;

        public PartiesController(TeamTrackerContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Hits EF InMemoryDatabase, returns list of all Parties
        /// </summary>
        /// <returns type="List<Party>">allParties</returns>
        // GET: api/Parties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Party>>> GetParty()
        {
            return await _context.Party.ToListAsync();
        }

        /// <summary>
        /// Hits EF InMemoryDatabase, searches for specific party by ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns type="party">Party</returns>
        // GET: api/Parties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Party>> GetParty(int id)
        {
            var party = await _context.Party.FindAsync(id);

            if (party == null)
            {
                return NotFound();
            }

            return party;
        }

        /// <summary>
        /// Hits EF InMemoryDatabase, if Party being passed in has an Id of 0, writes new record
        /// If party's id is currently in DB, runs an update
        /// 
        /// This method of PUT over POST for adding a new record was chosen because EF's InMemoryDatabase is not a
        /// relational database, so there were some issues in generating a key for the new item when using a POST
        /// Instead, when writing a new record, the UI hits "api/Parties/0", grabs the whole list of Parties, and adds an id = to the last records 
        /// Id + 1; this is not ideal for a large application
        /// </summary>
        /// <param name="id"></param>
        /// <param name="party"></param>
        /// <returns type="Party">updatedParty</returns>
        // PUT: api/Parties/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParty(int id, Party party)
        {
            if (id != party.Id)
            {
                return BadRequest();
            }

            if (id == 0)
            {
                var partyList = await _context.Party.ToListAsync();
                party.Id = partyList[partyList.Count - 1].Id + 1;
                _context.Party.Add(party);
            }
            else
            {
                _context.Entry(party).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PartyExists(id))
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
        // POST: api/Parties
        [HttpPost]
        public async Task<ActionResult<Party>> PostParty(Party party)
        {
            _context.Party.Add(party);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetParty", new { id = party.Id }, party);
        }

        /// <summary>
        /// Deletes record from EF InMemoryDatabase with id matching the param id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // DELETE: api/Parties/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Party>> DeleteParty(int id)
        {
            var party = await _context.Party.FindAsync(id);
            if (party == null)
            {
                return NotFound();
            }

            _context.Party.Remove(party);
            await _context.SaveChangesAsync();

            return party;
        }

        /// <summary>
        /// Looks through list of all Party records, 
        /// if the param id exists in the list, return true
        /// else return false
        /// </summary>
        /// <param name="id"></param>
        /// <returns type="boolean"></returns>
        private bool PartyExists(int id)
        {
            return _context.Party.Any(e => e.Id == id);
        }
    }
}
