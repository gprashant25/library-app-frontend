
// here in this oktaConfig.ts file is going to have all of our information that we need to now work with our third party service within Okta.

export const oktaConfig = {

    clientId: '0oajcrwujunVZXyfm5d7',
    issuer: 'https://dev-26094143.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid','profile','email'],
    pkce: true,
    disableHttpsCheck: true,
}