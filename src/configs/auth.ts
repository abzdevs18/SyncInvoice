export default {
  // meEndpoint: '/auth/me',
  // loginEndpoint: '/jwt/login',
  meEndpoint: `${process.env.BASE_URL}/api/user/auth/me`,
  loginEndpoint: `${process.env.BASE_URL}/api/user/auth/login`,
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
