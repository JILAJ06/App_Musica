export const environment = {
  production: false,
  spotify: {
    clientId: '794acf82b75f4875bbc3b832e1f9f1e0',
    clientSecret: 'bcbd1c2a2eff4413bc0f715a9d1e0eae',
    redirectUri: 'http://127.0.0.1:4200/callback',
    scopes: [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'user-library-read'
    ]
  }
};
