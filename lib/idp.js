const {
  ISSUER,
  IDP_PORT,
  SP_PORT,
  ASSERTION_CONSUMER_PATH,
  AUDIENCE,
} = require('./config.json')
const { runServer } = require('saml-idp')
const path = require('path')

runServer({
  port: IDP_PORT,
  issuer: ISSUER,
  acsUrl: `http://localhost:${SP_PORT}${ASSERTION_CONSUMER_PATH}`,
  audience: AUDIENCE,
  cert: path.resolve(__dirname, 'cert/idp-public-cert.pem'),
  key: path.resolve(__dirname, 'cert/idp-private-key.pem'),
})
