import { HttpInterceptorFn} from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { inject } from '@angular/core';
import { CookiesStorageService } from '../../services/general/cookies-storage-service';

export const addAuthHeaderInterceptor: HttpInterceptorFn = (req, next) => {

  const _cookieStorage: CookiesStorageService = inject(CookiesStorageService)

  const spotifyApiUrl = (environment as any).spotifyApiUrl;
  if (!spotifyApiUrl || !req.url.includes(spotifyApiUrl))
    return next(req)

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${_cookieStorage.getKeyValue('access_token')}`)
  })

  return next(newReq);
};
