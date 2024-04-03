import { SignJWT } from "jose"

const secret = new TextEncoder().encode(
    'r5cqlrGyK8JZwHop2t8B4lWbcoCliCSX',
  )
  const alg = 'HS256'
  
export const getToken = () => {
    const jwt = new SignJWT({ 'urn:example:claim': true })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .sign(secret)
    return jwt;
}