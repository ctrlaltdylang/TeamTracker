using System.Collections.Generic;

namespace TeamTracker.Models
{
    /// <summary>
    /// A D&D Adventuring Party, and their logo
    /// Logos are predetermined from a list of Material Icons in the UI
    /// </summary>
    public class Party
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }

        /// <summary>
        /// Below is used by Entity Framework to create a One-To-Many Relationship between Party and Player
        /// </summary>
        public virtual ICollection<Player> Players { get; set; }
    }
}
