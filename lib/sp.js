const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const saml = require('passport-saml')
const session = require('express-session')

const {
  ISSUER,
  ASSERTION_CONSUMER_PATH,
  IDP_PORT,
  AUDIENCE,
} = require('./config.json')

const app = express()

passport.serializeUser(function(user, done) {
  done(null, user)
})
passport.deserializeUser(function(user, done) {
  done(null, user)
})

const samlStrategy = new saml.Strategy(
  {
    path: ASSERTION_CONSUMER_PATH,
    entryPoint: `http://localhost:${IDP_PORT}`,
    issuer: ISSUER,
    audience: AUDIENCE,
  },
  function(profile, done) {
    const user = profile
    if (!user) {
      done(null, false, { message: 'Incorrect password.' })
      return
    }
    return done(null, user)
  },
)

app.use(
  session({
    secret: 'xxxxxxxx',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  }),
)

passport.use(samlStrategy)
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', (req, res) => {
  if (req.user) {
    res.json(req.user)
  } else {
    res.redirect('/login')
  }
})

app.get(
  '/login',
  passport.authenticate('saml', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function(req, res) {
    res.redirect('/')
  },
)

app.post(
  ASSERTION_CONSUMER_PATH,
  passport.authenticate('saml', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function(req, res) {
    res.redirect('/')
  },
)

app.listen(3000, () => {
  console.log(`Access to http://localhost:${3000}/login on your browser.`)
})
