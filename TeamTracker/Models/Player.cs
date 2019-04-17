using System.Collections.Generic;

namespace TeamTracker.Models
{
    /// <summary>
    /// A member of a D&D Adventuring Party, and their identifying avatar
    /// Avatars are predetermined from a list of Material Icons in the UI
    /// </summary>
    public class Player
    {
        public int Id { get; set; }
        public int PartyId { get; set; }
        public string Name { get; set; }
        public string Avatar { get; set; }
        public string Class { get; set; }
        public int Level { get; set; }
        public string Race { get; set; }
        public string Alignment { get; set; }
        public int Experience { get; set; }
        public int Strength { get; set; }
        public int Dexterity { get; set; }
        public int Constitution { get; set; }
        public int Intelligence { get; set; }
        public int Wisdom { get; set; }
        public int Charisma { get; set; }
        public int MaxHP { get; set; }
        public int Initiative { get; set; }
        public int Speed { get; set; }
        public int ArmorClass { get; set; }
        public int PassivePerception { get; set; }

        /// <summary>
        /// Below is used by Entity Framework to create a One-To-Many Relationship between Party and Player
        /// </summary>
        public virtual Party Party { get; set; }
    }
}
