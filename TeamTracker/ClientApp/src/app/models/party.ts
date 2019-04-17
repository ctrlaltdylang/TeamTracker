/**
* A D&D Adventuring Party, and their logo
* Matches JSON return from .NET Core endpoint, so properties are in camelCase
*/

export interface Party {
  id: number;
  name: string;
  logo: string;
}
