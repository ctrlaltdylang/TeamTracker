using Microsoft.EntityFrameworkCore;
using TeamTracker.Models;

namespace TeamTracker.Context
{
    /// <summary>
    /// This class is used by EntityFramework to build the database based off the data models
    /// </summary>
    public class TeamTrackerContext : DbContext
    {
        public TeamTrackerContext(DbContextOptions<TeamTrackerContext> options) : base(options)
        {
        }

        /// <summary>
        /// Creates the Party table
        /// </summary>
        public DbSet<Party> Party { get; set; }

        /// <summary>
        /// Creates the Player table
        /// </summary>
        public DbSet<Player> Player { get; set; }
    }
}