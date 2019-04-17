import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Party } from '../models/party';
import { Player } from '../models/player';
import { DataService } from '../data.service';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  /** list of material icons to be used as the partys' logos */
  logoList: string[] = ['group', 'account_balance', 'hourglass_empty', 'gavel', 'pets', 'brightness_4', 
    'new_releases', 'functions', 'monetization_on', 'cloud', 'memory', 'toys', 'audiotrack', 'colorize'];

  /** list of material icons to be used as the players' avatars */
  avatarList: string[] = ['account_circle', 'accessibility', 'android', 'face', 'fingerprint', 'lock',
    'brush', 'flash_on', 'healing', 'nature_people', 'local_dining', 'ac_unit', 'whatshot', 'sentiment_very_satisfied'];

  /** used to show/hide the loading spinner */
  showSpinner: boolean;

  /** list of all Parties returned from API when running a GET all */
  allParties: Party[] = [];

  /** user's active/selected party, UI populates player information from here */
  selectedParty: Party;

  /** list of players belonging to the selected party */
  partyPlayers: Player[] = [];

  /** Player being edited in Contributor mode (i.e. the player panel that is open in the UI) */
  selectedPlayer: Player;

  /** Used to switch between Contributor Mode and Visitor Mode (edit mode vs view-only mode) */
  contributorStatus: boolean = false;

  /** Used to display the Add Party UI elements */
  addParty: boolean = false;

  /** Used to display the Edit Party UI elements */
  updateParty: boolean = false;

  /** Used to display the Add Player UI elements */
  addPlayer: boolean = false;

  /** Used to create new party model using the new party information from the UI */
  newPartyName: string;
  newPartyLogo: string;

  /** Used to create updated party model using the updated party information from the UI */
  updatePartyName: string;
  updatePartyLogo: string;

  /** Used to create new player model using the new player information from the UI */
  newPlayerName: string;
  newLevel: number;
  newRace: string;
  newClass: string;
  newAlignment: string;
  newExperience: number;
  newStrength: number;
  newDexterity: number;
  newConstitution: number;
  newIntelligence: number;
  newWisdom: number;
  newCharisma: number;
  newMaxHP: number;
  newInitiative: number;
  newSpeed: number;
  newArmorClass: number;
  newPassivePerception: number;
  newAvatar: string;

  /** Used to create updated player model using the updated player information from the UI */
  updatePlayerName: string;
  updateLevel: number;
  updateRace: string;
  updateClass: string;
  updateAlignment: string;
  updateExperience: number;
  updateStrength: number;
  updateDexterity: number;
  updateConstitution: number;
  updateIntelligence: number;
  updateWisdom: number;
  updateCharisma: number;
  updateMaxHP: number;
  updateInitiative: number;
  updateSpeed: number;
  updateArmorClass: number;
  updatePassivePerception: number;
  updateAvatar: string;
  

  constructor(private dataService: DataService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getParties(null);
  }

  /**
   *  When spinner is on, the HTML is disabled
   *  This is so everything loads fully in the background, then the HTML displays with no errors
  */
  toggleSpinner() {
    this.showSpinner = !this.showSpinner;
  }

  /**
   *  Switches the Add Party UI Elements on/off
   *  If the Update Party elements are on when the Add Party elementts turn on, they are disabled
  */
  toggleAddParty() {
    this.addParty = !this.addParty;
    if (this.updateParty === true) {
      this.updateParty = !this.updateParty;
    }
  }

  /**
   *  Switches the Update Party UI Elements on/off
   *  Populates the Update Party UI Elements with the selected party information
   *  If the Add Party elements are on when the Update Party elements turn on, they are disabled
  */
  toggleEditParty(party: Party) {
    this.updateParty = !this.updateParty;
    if (this.addParty === true) {
      this.addParty = !this.addParty;
    }
    this.updatePartyName = party.name;
    this.updatePartyLogo = party.logo;
  }

  /**
   *  When the user opens a player panel,
   *  populate the UI elements with the selected player information  
  */
  openPanel(player: Player) {
    this.updatePlayerName = player.name;
    this.updateLevel = player.level;
    this.updateRace = player.race;
    this.updateClass = player.class;
    this.updateAlignment = player.alignment;
    this.updateExperience = player.experience;
    this.updateStrength = player.strength;
    this.updateDexterity = player.dexterity;
    this.updateConstitution = player.constitution;
    this.updateIntelligence = player.intelligence;
    this.updateWisdom = player.wisdom;
    this.updateCharisma = player.charisma;
    this.updateMaxHP = player.maxHP;
    this.updateInitiative = player.initiative;
    this.updateSpeed = player.speed;
    this.updateArmorClass = player.armorClass;
    this.updatePassivePerception = player.passivePerception;
  }

  /**
   *  Used to switch between Contributor Mode and Visitor Mode
   *  Contributor Mode = User can create, edit, and delete players and parties
   *  Visitor Mode = View-Only mode, user can only view information
  */
  changeStatus() {
    this.contributorStatus = !this.contributorStatus;
    if (this.addParty === true) {
      this.addParty = false;
    }

    if (this.addPlayer === true) {
      this.addPlayer = false;
    }
  }

  /**
    * Gets all parties from API
    * if a party is being passed in, loop through all parties and set the active party to the newly updated party
    * else, set active party as the first party in the list
    * @param party updated party passed from putParty()
  */
  getParties(party: Party) {
    this.toggleSpinner();
    this.dataService.getParties()
      .subscribe(data => {
        this.allParties = data;
        if (party != null) {
          this.allParties.forEach(x => {
            if (x.id === party.id) {
              this.selectedParty = x
            } else {
              this.selectedParty = this.allParties[0];
            }
          })
        } else {
          this.selectedParty = this.allParties[0];
        }
        this.getPlayers(this.selectedParty.id);
      });
  }

  /**
    * Gets list of players belonging to the active party from API
    * @param partyNum active/selected Party's ID
  */
  getPlayers(partyNum: number) {
    this.dataService.getPlayerByParty(partyNum)
      .subscribe(data => {
        if (data != undefined) {
          this.partyPlayers = data;
        } else {
          this.partyPlayers = [];
        }
        this.toggleSpinner();
      }, error => {
        this.snackBar.open('An error occurred, please try again', 'Ok!', {
          duration: 2000,
        });
      });
  }

  /**
    * Switches active party to party being passed in,
    * Then gets list of players belonging to the new active party
    * @param party new active party
  */
  changeSelectedParty(party: Party) {
    this.toggleSpinner();
    this.selectedParty = party;
    this.getPlayers(this.selectedParty.id);
  }

  /**
    * Sends user-input Party to API,
    * Reloads API with the new party as the active party
    * Runs getPlayers() method to clear the UI since the new party will have no members
    * PUT is used over POST due to having issues with the EF InMemoryDatabase, see notes in controllers for more info
  */
  addNewParty() {
    if (this.newPartyLogo === null) {
      this.newPartyLogo = this.logoList[0];
    }
    let newParty: Party = {
      id: 0,
      name: this.newPartyName,
      logo: this.newPartyLogo
    }
    this.dataService.updateParty(newParty)
      .subscribe(data => {
        this.dataService.getParties()
          .subscribe(data => {
            this.toggleSpinner();
            this.allParties = data;
            this.selectedParty = this.allParties[this.allParties.length - 1];
            this.getPlayers(this.selectedParty.id);
            this.snackBar.open('Party added!', 'Ok!', {
              duration: 2000,
            })
          });
      }, error => {
          this.snackBar.open('An error occurred, please try again', 'Ok!', {
            duration: 2000,
          });
      });
    this.newPartyName = '';
    this.addParty = !this.addParty;
  }

  /**
    * Sends user-input Party to API
    * Updates active Party's information
    * @param oldParty party to be updated with user input
  */
  putParty(oldParty: Party) {
    let updatedParty: Party = {
      id: oldParty.id,
      name: this.updatePartyName,
      logo: this.updatePartyLogo
    }
    this.dataService.updateParty(updatedParty)
      .subscribe(data => {
        this.getParties(oldParty);
      }, error => {
        this.snackBar.open('An error occurred, please try again', 'Ok!', {
          duration: 2000,
        });
      });
    this.updatePartyName = '';
    this.updateParty = !this.updateParty;
  }

  /**
    * Deletes active party from both UI and API/DB
    * @param partyNum active party's id to be deleted
  */
  deleteParty(partyNum: number) {
    this.dataService.deleteParty(partyNum)
      .subscribe(data => {
        this.getParties(null);
        this.snackBar.open('Party deleted', 'Ok!', {
          duration: 2000,
        });
      }, error => {
        this.snackBar.open('An error occurred, please try again', 'Ok!', {
          duration: 2000,
        });
      });
  }

  /**
    * Sends user-input new player to API,
    * Runs getPlayers() method to update the UI with new party member in list
    * PUT is used over POST due to having issues with the EF InMemoryDatabase, see notes in controllers for more info
    * @param party active party's id used to reload API with updated party list, and set player to active party
  */
  addNewPlayer(party: Party) {
    if (this.newAvatar === '') {
      this.newAvatar = this.avatarList[0]
    }
    if (this.newPlayerName === '') {
      this.newPlayerName = "New Player"
    }
    let newPlayer: Player = {
      id: 0,
      partyId: party.id,
      name: this.newPlayerName,
      class: this.newClass,
      avatar: this.newAvatar,
      level: 1,
      race: this.newRace,
      alignment: this.newAlignment,
      experience: 0,
      strength: this.newStrength,
      dexterity: this.newDexterity,
      constitution: this.newConstitution,
      intelligence: this.newIntelligence,
      wisdom: this.newWisdom,
      charisma: this.newCharisma,
      maxHP: this.newMaxHP,
      initiative: this.newInitiative,
      speed: this.newSpeed,
      armorClass: this.newArmorClass,
      passivePerception: this.newPassivePerception
    }
    this.dataService.putPlayer(newPlayer)
      .subscribe(data => {
        this.snackBar.open('Player Updated!', 'Ok!', {
          duration: 2000,
        })
        this.toggleSpinner();
        this.getPlayers(this.selectedParty.id);
      }, error => {
        this.snackBar.open('An error occurred, please try again', 'Ok!', {
          duration: 2000,
        });
      });
    this.newPlayerName = '';
    this.addPlayer = !this.addPlayer;
  }

  /**
    * Sends user-input Party to API
    * Updates active player's information
    * @param party active party's id used to reload API with updated party list, and set player to active party
    * @param player player to be updated with user input
  */
  updatePlayer(party: Party, player: Player) {
    if (this.updateAvatar === '') {
      this.updateAvatar = player.avatar
    }
    let updatedPlayer: Player = {
      id: player.id,
      partyId: party.id,
      name: this.updatePlayerName,
      avatar: this.updateAvatar,
      class: this.updateClass,
      level: this.updateLevel,
      race: this.updateRace,
      alignment: this.updateAlignment,
      experience: this.updateExperience,
      strength: this.updateStrength,
      dexterity: this.updateDexterity,
      constitution: this.updateConstitution,
      intelligence: this.updateIntelligence,
      wisdom: this.updateWisdom,
      charisma: this.updateCharisma,
      maxHP: this.updateMaxHP,
      initiative: this.updateInitiative,
      speed: this.updateSpeed,
      armorClass: this.updateArmorClass,
      passivePerception: this.updatePassivePerception
    }
    this.dataService.putPlayer(updatedPlayer)
      .subscribe(data => {
        this.snackBar.open('Player added!', 'Ok!', {
          duration: 2000,
        })
        this.toggleSpinner();
        this.getPlayers(this.selectedParty.id);
      }, error => {
        this.snackBar.open('An error occurred, please try again', 'Ok!', {
          duration: 2000,
        });
      });
  }

  /**
    * Deletes active player from both UI and API/DB
    * @param playerNum player's id to be deleted
    * @param partyNum active party's id used to reload API with updated party list
  */
  deletePlayer(playerNum: number, partyNum: number): void {
    this.dataService.deletePlayer(playerNum)
      .subscribe(data => {
        this.toggleSpinner();
        this.getPlayers(partyNum);
        this.snackBar.open('Player deleted', 'Ok!', {
          duration: 2000,
        });
      }, error => {
        this.snackBar.open('An error occurred, please try again', 'Ok!', {
          duration: 2000,
        });
      });
  }

  /**
   * Used to update new Party logo with chosen material icon
   * @param logo material icon name, stored in the party.logo property
  */
  addLogo(logo: string) {
    this.newPartyLogo = logo;
  }

  /**
   * Used to update active Party logo with chosen material icon
   * @param logo material icon name, stored in the party.logo property
  */
  changeLogo(logo: string) {
    this.updatePartyLogo = logo;
  }

  /**
   * Used to update new player avatar with chosen material icon
   * @param avatar material icon name, stored in the player.avatar property
  */
  addAvatar(avatar: string) {
    this.newAvatar = avatar;
  }

  /**
   * Used to update active player avatar with chosen material icon
   * @param avatar material icon name, stored in the player.avatar property
  */
  changeAvatar(avatar: string) {
    this.updateAvatar = avatar;
  }
}
