import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyLoginService {

  constructor(
    private _http:HttpClient
  ) {  }

  getToken(): Observable<any> {
    const body = new HttpParams()
      .set("grant_type", "")
      .set("client_id", "")
      .set("client_secret", "");
    return this._http.post<any>(
      "https://accounts.spotify.com/api/token", 
      body.toString(),
      {
        headers: {'Content-Type': "application/x-www-form-urlencoded"}
      }
    );

  }
}
