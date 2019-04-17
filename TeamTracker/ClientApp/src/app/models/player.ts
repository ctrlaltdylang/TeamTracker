/**
* A member of a D&D Adventuring Party, and their identifying avatar
* Matches JSON return from .NET Core endpoint, so properties are in camelCase
*/

export interface Player {
  id: number;
  partyId: number;
  name: string;
  avatar: string;
  level: number;
  class: string;
  race: string;
  alignment: string;
  experience: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  maxHP: number;
  initiative: number;
  speed: number;
  armorClass: number;
  passivePerception: number;
}
