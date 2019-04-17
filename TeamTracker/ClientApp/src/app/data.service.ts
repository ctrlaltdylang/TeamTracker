import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Party } from './models/party';
import { Player } from './models/player';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({ providedIn: 'root' })
export class DataService {

  /** URL for localhost application */
  private url = 'https://localhost:44321/api/';

  constructor(private http: HttpClient) { }

  /** Hits the REST endpoints from .NET Core API/Controllers here */
  getParties(): Observable<Party[]> {
    return this.http.get<Party[]>(this.url + 'parties');
  }

  updateParty(party: Party): Observable<Party> {
    return this.http.put<Party>(this.url + 'parties/' + party.id, party, httpOptions);
  }

  deleteParty(partyNum: number): Observable<Party> {
    return this.http.delete<Party>(this.url + 'parties/' + partyNum);
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.url + 'players');
  }

  getPlayerByParty(partyNum: number): Observable<Player[]> {
    return this.http.get<Player[]>(this.url + 'players/party/' + partyNum);
  }

  putPlayer(player: Player): Observable<Player> {
    return this.http.put<Player>(this.url + 'players/' + player.id, player, httpOptions);
  }

  deletePlayer(playerNum: number): Observable<Player> {
    return this.http.delete<Player>(this.url + 'players/' + playerNum);
  }
}

