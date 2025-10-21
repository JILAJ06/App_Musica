import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyLoginService {
  
  constructor(
    private _http:HttpClient
  ){  }

  getAccessToken(): Observable<any> {

    const body = new HttpParams()
      .set('grant_type','client_credentials')
      .set('client_id', '794acf82b75f4875bbc3b832e1f9f1e0')
      .set('client_secret','bcbd1c2a2eff4413bc0f715a9d1e0eae');

    return this._http.post<any>(
      environment.spotifyTokenUrl,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  }

}
