using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using TeamTracker.Models;

namespace TeamTracker.Context
{
    /// <summary>
    /// This class is used to seed data in the EF InMemoryDatabase
    /// </summary>
    
    public class DataGenerator
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new TeamTrackerContext(
                serviceProvider.GetRequiredService<DbContextOptions<TeamTrackerContext>>()))
            {
                if (context.Player.Any() || context.Party.Any())
                {
                    return;   // Database has been seeded
                }
                else
                {
                    #region Seeding Player Data
                    context.Player.AddRange(
                        new Player
                        {
                            Id = 1,
                            PartyId = 1,
                            Name = "John",
                            Avatar = "account_circle",
                            Class = "Fighter",
                            Level = 1,
                            Race = "Human",
                            Alignment = "True Neutral",
                            Experience = 0,
                            Strength = 16,
                            Dexterity = 9,
                            Constitution = 15,
                            Intelligence = 11,
                            Wisdom = 13,
                            Charisma = 14,
                            MaxHP = 12,
                            Initiative = -1,
                            Speed = 30,
                            ArmorClass = 17,
                            PassivePerception = 13
                        },
                        new Player
                        {
                            Id = 2,
                            PartyId = 1,
                            Name = "Lachlan",
                            Avatar = "account_circle",
                            Class = "Cleric",
                            Level = 1,
                            Race = "Dwarf",
                            Alignment = "Lawful Good",
                            Experience = 0,
                            Strength = 14,
                            Dexterity = 8,
                            Constitution = 15,
                            Intelligence = 10,
                            Wisdom = 16,
                            Charisma = 12,
                            MaxHP = 11,
                            Initiative = -1,
                            Speed = 25,
                            ArmorClass = 18,
                            PassivePerception = 13
                        },
                        new Player
                        {
                            Id = 3,
                            PartyId = 1,
                            Name = "Sindarin",
                            Avatar = "account_circle",
                            Class = "Wizard",
                            Level = 1,
                            Race = "High Elf",
                            Alignment = "Chaotic Good",
                            Experience = 0,
                            Strength = 10,
                            Dexterity = 15,
                            Constitution = 14,
                            Intelligence = 16,
                            Wisdom = 12,
                            Charisma = 8,
                            MaxHP = 9,
                            Initiative = 2,
                            Speed = 30,
                            ArmorClass = 12,
                            PassivePerception = 13
                        }, 
                        new Player
                        {
                            Id = 4,
                            PartyId = 1,
                            Name = "Balrogg",
                            Avatar = "account_circle",
                            Class = "Barbarian",
                            Level = 1,
                            Race = "Half Orc",
                            Alignment = "Chaotic Neutral",
                            Experience = 0,
                            Strength = 16,
                            Dexterity = 13,
                            Constitution = 14,
                            Intelligence = 12,
                            Wisdom = 12,
                            Charisma = 10,
                            MaxHP = 14,
                            Initiative = 1,
                            Speed = 30,
                            ArmorClass = 13,
                            PassivePerception = 13
                        }
                    );
                    #endregion

                    #region Seeding Party Data
                    context.Party.AddRange(
                        new Party
                        {
                            Id = 1,
                            Name = "Fey Wildin' Out",
                            Logo = "group"
                        }
                    );
                    #endregion
                    context.SaveChanges();
                }
            }
        }
    }
}
