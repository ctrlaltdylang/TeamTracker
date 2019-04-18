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

  /** used to show/hide the loading spinner */
  showSpinner: boolean;

  /** used in image uploading */
  files: any;
  filestring: any;

  /** mustache image used as default if user does not upload one */
  defaultImage: string = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIABAMAAAAGVsnJAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUdwTGEyAmEyAmExAmEyAmExAmEyA0QhAIFKIV8wAUIfAFYrAU0mAJVqvc4AAAAGdFJOUwDUdCKlSog+m28AABNgSURBVHja7Z3Pc9PItsdDHL81XMDr3DeD1wFmsoYBsg4MZJ9M0s9dYa9CZO3S/ANNdJ2962myNjfEa1zE/qNedetXS1b/kmTfea7vZ0UFS93n9DmnT7eOWltbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIB1sb23mXJ1di1/+H5TR/aN5e8ebaoCXlp6wNmmKuDIzgf2/9hUBVhKdvBwUxXw9NTmV11yf1MVcI8cWv3qxaYqYMdqbPubrIATi2yhR3Y3VQHb5HjP4kebrAAL2faJVaT4f0mXEPNEeLDZCjBOhB2y2QogpiCws+kK2DWGAEY3WAHMGAT6hG22BZgygR653GALGBBybJop6WCD84ABNQWBe4S0p4DOh59fPnjw6PWT32sO2LvX/PrfPrS1Rbd9+ScxLAeOCAlYO2uB7s89kvLoJ/frn73MLj/+rR0V7HAF/GFKg4J2FkPvc/GFChyt4NeXhcuP37SjgCHTp0KdHrkMJi3sB3SL/ec4ifB+6fLTFkLzvcuA6ddDXUIuh6z5ltizHlnmkbUdd15WXH78U+Nu7V8GVJ/n7RA6CNjZSuS3H8TuQeXlzTVwJBTwQpsHhsGQnTSVnyg4ttJAt6e6vqkG+iQwRME+oUHATps1s01IEw2o5W+8U3Ew4Ao4MUwCATtuFv80Alh4QUd3+XGzSNi7DPTTQIcQFgSTRouBzgHRcbq30ssNS4HLIGC6FTGfBPhPmljaW7m/NIyR/nRictOc5YsJedzIN/8tFHConwSCSZMHAzuy9IwMBkEwGBASsuzP2scuT/Or44uHQ64ISQMNsrR7fHi10wBfCXAdnbURAEJGgoyhpIJdi/hJ5YsDWX8NwsBRooD7ml9QoYD682BuwaEsAVcBTYVQp2JZAFRfTBp17jLg08CZfhYMqM3uuckBwkFQJhPiRLMUM15c3wk6PT682nlQzIIBrT3f5lMYXRaBW7JehFR9rOriXAN1h2ebJAo41fSfBQYv2bIKYZXyBwFhOhFS9bHqi6ldGN0yRLghU28KxWmA3ktMW26JDEGg1cCZxgEU8vOepxzWjIE0VoAyEeAxOFb1cc0WUhQy5Ia8q5wBmPHauuPTI2Gix11NCBNTVr0gsG1wANmQTysDkN219bvHQzzPhF4onYReJjqq42Z5EquWIRgmUtyv8FAuv/bazATqLNf2cwWoQtx/iUxYtHPaYArUDWImRTkOJhGQ6S6VTOBFrfERd5+oFbAfWwDXkXuckVZxgV4KVhXKnxqCR8kE3KfCbtozpt4ROIotgOvI3QeyRVAYGKAVoTxOofW2wycoVntR9DRVb6gOov3EAmgNL9u2cwBpHM8qJpDAUnk14uBB2jWmTgUPEgugNRo4MKUAWhPoWuqufhzcye4fqq/tJRbwp/ua4605BdCZgK0ByCbg5gT9zDmZOs3pJRYQd/CwjgPYGECiYamFxABsLg1YLSfo5n2bKBUg4niugLM6M0BoJUQyjo8LBhBbn4MTuMwER5mF8esVV3YyK3TNuPv2EbAQzfekhu1sJ/Zh552BruSdTFknk82UyQCducwwxNqLpRYeytdfWl46ZO7LwqNcAUN1ltPNhuFPJyfLA4CtAaQmEJti7EA0cFOeew9pYKGAc1nJdiaWbwNSawNIpbifrQLopf21oesGYV8yz6Hau7fzMUzu/8rtOQCzlyExstMshaAu10pbpDaB8Bci+ZgmydnOAwW1VrD8IGPgIEQyne2m9vlvl2up05OS1EQHJgXsSHbCLG8vyU9dDCAV4iSxT+qkvGHooIG0i0xS/AuTArJ047H9+LvJn+r4sOs2fSzNBEYN/DMZn0vpSo0C6KBoZI9tH+S7jWE+Ez5tcLHNA9e3xf5RYrKAy5KK39jVQVDHMUybOD6oYT0lDegqJ96XUhRiVACzXnQU6ngUIgw0QytdrZkDFXeQnUAzSm9LBppcplMAGZQb+EelkxXLoKr3coc0DIlpSaSdP9R3IAUNPKp0g84/ywNEzRaQ2grVmljn50IdQ7UPx8F6YI5kTGvpiumFsmId3Z7ORYsGYFDAYNnGSlV+JfFVMSy0kE4fAuNOqDRQqh4pVVMWKw2Ll+gVwKru/yird33+7mWpikXfQbV4fxLbXwxM2UCsgkdPnqfSv3tZMUJZCqlXQCJPxf1fv3798sFS2YpC/qH5MZFxE4HpQ0y4XEPzoKqTyRSV//6FqbqrItAqUcnPjArILECpgIl+nV2lgSpYcUS0awG5PcIayB+aNwmoSUW5Ei1a0cg/KMlvoQBWfKDvLH9ALHJkcwxghDS2AcoGS/a8a3i6ndXoyMU5TvJTQlq1gPoaCGP5aeF3h0YFpIYzpNoGFEnKkLJWFBAU1W/TVnmAQlIq0dIooFO6eMR4m9rhJxYDp97rMWfCjFik2/oxCgaEslLKQPasFCCUEBqNS10KZPBwi0yQVnlzRYMaI6C04o979lW6SgMLVcNfbjG0WNRbLBe0a05jrCplNOonQ5aESvGXp07l8ObzEg2soqAu6oguNVXAgVXeE4qmrAMSG5jtmw7sNUBDRcyMC5OtFHDaRAGEVK/Qh0NyMyEO8ssRTr1gqkrGlDoYWFrAqUWltp7hMEi7MBTF0GRUrXzNXpfs39Ru60e64JbxkRgM004Mh8OhdfdPjGVuxhjAwvD2RsBGumlIo4DQ7mdU642T0e1oNLpho9AlBpyp66isofEEQ6mpWTvvZjYbZ4pMnzFK3PhDXUvaPgO7KX7gbgD1ua8pI2Fr0kDZctjAchZoCtMU2XEFjNZjAxWCWSSVLXCuUwBfDV21bwIV6VvFGq5iXTmk7XfmSlcEyRcDXybtN7pk35UDW870h6vwfvaN6Q5S6RHyP59W0S5/fSrPmFQDG0p+MFxBNOJa9piuFv6AkI/XK2mXEXqTDkKo3WBI8pyQrKQfQrxTXSXFx2iyEtX/Tfhyra182ecK+L7B8pO7a6p7e/oeoefjv+jGip9Id19XUHs+9jfYB754f2lfNujyMOl92lwLuPP+V1sB2iGE+t71xsr/cex/0p+ndkDInbexPsC+ef53faF9X/zo04aGQep7/nf9m9H7hHzzvPGGWsDHsbDuP/Rvl34ZCzvZyCTA8zymfy94W6hpnWHwpL+2ps4TyXQV1h2eK3ieP1mHR4rE/4XYhVlH0GHfPM/jieCe/t0nrgBvHdkgG4l3N/jzqBFbfdQRI+t9Nr1tdUSI73lrmQnpj3h/9ij55zoMgKcBZ4Z37BkPFas3AUqmjKXV4uxqsvL2ziMu13fT2Qg7hPzL89YRBa54tpG8L0DpBVu5AYwTsfRvmXQIuRoLE1hxf849lr6k/pQQ9uXzGqaAeBY0FJcfxMHC8783NUrdjiajdyLdPEyXYPRurtsDa+4g37zEs01vnB7xhJFz3WxTjhGifmjP6Oya5e/w9nkUGP8gmlKEhg8s2MfYAD6Z34VLo6Dn/6DNpL9dLJhK/q+RuPuLLPBQeqfWwGgxv2mkA0oTmb6bz4fp8l0DwXhS3/TpaOFF6sA2GwsDOJYrMz6Ox8rJcOSPL+ZhvmfqvhESG4A3sXgdtEcSc/H/qqNyPrDhdOZH0Wem+AGdRbF5PSy8eXnnj38onJ2N/CgaL/gjcVor4sZezRNh8/Ewfb4plDhBHfHF4Eee/7k6v2XkfBYli43iy9Mfx/54Xm3nlNuAH8Vm4K6CxAFEHmh+F/JevGqKnYC6iz/zo7HnRUr5R3fpcrP8+vyd50VzldmMfH7XyJvfuKqAkq+JA9iEAJGYpR7jX7usUvhPb2eRSLhU8hM65YLEScZuqUqXz7/RxU2lESQa8Pxo7KgCSq6iZEA9ZvWybS/JBHhzn5lD5KejRHyF/JSQ0UyYhwivp0vlSXykovGcEarWQKoC+46lAUAsBW1OiMoyASGJ/cSXiV8tPxXDHwm1ij/cX3pXQXTVF0ZA1Rrw/MjjnsIsA+BdNpyf7N6IvxcvnBJZ5pbWP1r4kaeWn4t/K4afhxa29NavKNJkse8prDzXAFdStZ1UBcBUfrHEtTklrkvSiVD05oe5IZaOrUL+ODOYpT+J91wrzhHK8pXIq5r1JQ0kdmI2AjrLRbm2PRTiQPIBYQPUOPzJ2FbJT+O0MPMP7zre/dirOuTjKhvicZz8hSoNKINFKeXI5eceYHf0zL7sA/HUxGyHvyh/KP5JR1MvEz9dZZ1V1+jdZT+LxhfxM3KpEK2gAc9kBDzlyH9t3BAunLx4PpY18Fmt6nj4C7+lhbNww9sFTwvzbiTr7MPqtxXO5XtF3mJ+k94pua2sAV9nBLxnd7IY1/YnZfakkdCrmiUTe4Y8a4Sj2wXPCiP5XskK40RVp/pVvhtPgC8W81t5WXk+q9czngXZHpN4lOdCkqqXGyoPv+eN57cx0+lixvsfFe7jZU+dVAcqUjn8JHbANbhYpHe+LapIGAGrnpULbfOnPbbHwuws9YMHXVbc4xChXfb+tLtJp6OoLIoUAU+UpcpZHCw078d3FLcu/b8wgkKwFBNIuWdC89aH8PWKYTCW7OI2Fj/zcDqdRRW91ZHuM+0q31qj5M7xntF4ccNIXsjPl89Tf8n0Jszh5KWjbA/NK8akzBtpeDv1XMVPc0DVkqxfSl3tVXCRB8twNJ35yz3j29z2Z2PtkGUTSOz7YjGfzxeL2bItWpDusexqDyT64n5j3pnFYjqdLhYici6rfuJ2DGWvNBMWY1I0jsbuncx32U605/1QeufVuXkcd6Jq+/mLuB2Vu5/to7ZItsW0qz/xiZ1HrTc9IYS4fDtmO3uU0iKpA5wYj3z6Mm5d9a5HRPIjWL+2241sm9l4vH5NJzCo3u0IyntxRckqHODMfOwbO2+36c+UuJ6XztfnlTlJYwfQr0jT95dbbTreg3c8iPeoTk6im6hSB3hoczZhq03H2ZfreeTb9XISTQpUfaK04v1d1mrTpM5x5P02LdG/TlcRr2yij2g6as0BSK0Pc+wUttQbBwD1qfLV76+21nTie/UOIy/sKTbqRLpS27V0vtaa9ue2iq+2xVZ8MQsAdpHoiJAWm47X37W+GdJryRfzAGA3FWXnGHxso2lKan+X5WlSzFSrG5L5XmePGF/ZNfxLVkcVVd7QQf4JtZl7DSNRRwNRvh+b1xmcOs1AxR3CcY2I4KdN1/0wT3pgsrsGovmdFACZTQ5YlQ+yPBD6c2cN+OMbwhoYQBYFmLMGos/Zs6UoL3566K566cne9chRA/51Kn/97yfupHusxR1m8/hn2+rS09VT5zk4TkbTh0U/Co85zJ24mBDt6YEu/WBk5Ef2ljfPKwwu8udETl8t6Ur1Qdm+Np3Zd4JXKDFSOwdYPl5sZLsDzCt90hlclv+VW8u/5PUNfpZN0K+WGhAPDh2SL2NSwp8zTq2MQGzTJ8Fblt85F+8vaSCalJ/2qIf/Jn9k1uwjwtnJ6ZSRkdkHY8tLImAkye8+EWXpENfAOKvdvLIYBj782ZOSht9pzUyRxyPj8kQ8qAqTDS1Z/jpmuE3KGvB/UFFkZhwHudTq1VZD+vwJb8gfdJp0n1perKdCneTDJmlIXCmZ5FQ2vsgLSG54l1mT71NKTkCnvmd+EJJULCSb2tFcGv+T2rrP6gLuonxf0RyQRWfFQ8MWPtnOncDseWnNSryjy6fCXP66HwvOj26norwyqd2MSzLGxv5M2nCAdCAMSo/SqqV4HyO6lqJwgzAkf7yCTnkPxM4KJeTcoAJhjqwFB0jiMdUqPRZfWCe7ilLlZ/I3mIe35QPuuO/78fN1FpelaTokRuB4rxUFJPGYKz2qdDfx4Jwlq5dU+RmNPhn/rFRlPE43V7gKppWByY+f5NPm32ovhgHR4qxY88EfR16Icq502v3Gn9YX6nZetTYN07gU90deBRLyqanco7iqnLUVAGLeJi3S0XSWPIcVDSdFTGG+fl/cFItVXrWhfKn6YzrL9xeYqFMQj+rlHqWvVjzeapF+9iYIDW9vb+eiZicuSqDyqx3lEs83zZt+Xy44ldIcStIeLaZZjyhrMveqAmFfehtG+TZTWP7Bmzbafl+uuWVL7+dU9Ohkb6tdDcifEwnzKsiKt4VatP9KL6gqClzq0WnL8hc1YMdxa0Hol55r2+3LX/hehZ38u+21/cxRA/9Ygfz5F3ssx+Cwzaa7B38D+UvhaL19cLG/N1srw9YUj3/arLZdB2I1JvifbNtpIE5XNgTPDv6zw58MxHutCo6frHAIOu/0bb/Z21oH5c8MSTx6suIudIrfzymI/9t6xE+60avqwe/raPzXKv0fr1z1ZZ6/e/2g0IHffl9bDzq//lwYgAevsy8srVkJv374b86TD8/31t125/mHd6LxD7/vbQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADw9+P/AI2sS/vLDU2dAAAAAElFTkSuQmCC';


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
  newPartyName: string = '';
  newPartyLogo: string = '';

  /** Used to create updated party model using the updated party information from the UI */
  updatePartyName: string = '';
  updatePartyLogo: string = '';

  /** Used to create new player model using the new player information from the UI */
  newPlayerName: string = '';
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
  newAvatar: string = '';

  /** Used to create updated player model using the updated player information from the UI */
  updatePlayerName: string = '';
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
  updateAvatar: string = '';
  

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

    if (this.contributorStatus === true) {
      this.snackBar.open('Contributor View enabled', 'Ok!', {
        duration: 2000,
      });
    } else {
      this.snackBar.open('Visitor View enabled', 'Ok!', {
        duration: 2000,
      });
    }

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
    if (this.newPartyLogo === '') {
      this.newPartyLogo = this.defaultImage;
    }

    if (this.newPartyName === '') {
      this.newPartyName = 'New Party';
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
    if (this.updatePartyLogo === '') {
      this.updatePartyLogo = oldParty.logo;
    }

    if (this.updatePartyName === '') {
      this.updatePartyName = oldParty.name;
    }

    let updatedParty: Party = {
      id: oldParty.id,
      name: this.updatePartyName,
      logo: this.updatePartyLogo
    }
    this.dataService.updateParty(updatedParty)
      .subscribe(data => {
        this.snackBar.open('Party updated!', 'Ok!', {
          duration: 2000,
        });
        this.getParties(oldParty);
        this.updatePartyLogo = '';
        this.updatePartyName = '';
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
    * Does not allow the user to delete the last party
    * @param partyNum active party's id to be deleted
  */
  deleteParty(partyNum: number) {
    if (this.allParties.length < 2) {
      this.snackBar.open('Cannot delete last party', 'Ok!', {
        duration: 2000,
      });
    } else {
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
  }

  /**
    * Sends user-input new player to API,
    * Runs getPlayers() method to update the UI with new party member in list
    * PUT is used over POST due to having issues with the EF InMemoryDatabase, see notes in controllers for more info
    * @param party active party's id used to reload API with updated party list, and set player to active party
  */
  addNewPlayer(party: Party) {
    if (this.newAvatar === '' || this.newAvatar === undefined) {
      this.newAvatar = this.defaultImage;
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
        this.snackBar.open('Player added!', 'Ok!', {
          duration: 2000,
        });
        this.newAvatar = '';
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
    if (this.updateAvatar === '' || this.updateAvatar === undefined) {
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
        this.snackBar.open('Player updated!', 'Ok!', {
          duration: 2000,
        });
        this.updateAvatar = '';
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
  * Adding/Updating parties' logos and/or players' avatars
  * For whatever reason, I couldn't get it to work in one method with a switch,
  * so each upload type now has 2 methods
  * @param event change/click event
*/
  addLogo(event) {
    this.files = event.target.files;
    var reader = new FileReader();
    reader.onload = this.assignNewLogo.bind(this);
    reader.readAsBinaryString(this.files[0]);
  }

  assignNewLogo(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.filestring = btoa(binaryString);
    this.newPartyLogo = this.filestring;
  }

  updateLogo(event) {
    this.files = event.target.files;
    var reader = new FileReader();
    reader.onload = this.assignUpdatedLogo.bind(this);
    reader.readAsBinaryString(this.files[0]);
  }

  assignUpdatedLogo(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.filestring = btoa(binaryString);
    this.updatePartyLogo = this.filestring;
  }

  addAvatar(event) {
    this.files = event.target.files;
    var reader = new FileReader();
    reader.onload = this.assignNewAvatar.bind(this);
    reader.readAsBinaryString(this.files[0]);
  }

  assignNewAvatar(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.filestring = btoa(binaryString);
    this.newAvatar = this.filestring;
  }

  updatePlayerAvatar(event) {
    this.files = event.target.files;
    var reader = new FileReader();
    reader.onload = this.assignUpdatedAvatar.bind(this);
    reader.readAsBinaryString(this.files[0]);
  }

  assignUpdatedAvatar(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.filestring = btoa(binaryString);
    this.updateAvatar = this.filestring;
  }

  
}
