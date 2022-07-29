import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import session from 'express-session'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import authRouter from './routes/auth';
import restaurantRouter from './routes/restaurant'
export interface TypedRequestUser<T extends Express.User> extends Express.Request {
  user: T
}

dotenv.config();
const GOOGLE_CLIENT_ID = '411255982749-uem7h7b4j3h8ngone58qs2dnlcvejrql.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GoogleOauth = GoogleStrategy.OAuth2Strategy
const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: '*'
}))
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
    cookie:{
      secure: false,
      httpOnly: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleOauth({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://ochko.website:8000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      const userProfile = profile;
      return done(null, userProfile);
  }
));
app.use('/auth', authRouter);
app.use('/restaurant', restaurantRouter);
// app.get('/', function(req, res) {
//   const userID = req.headers.cookie?.substring(5, 41)
//   // console.log(userID);
//   res.json({message: "atleast it's working"});
// });

passport.serializeUser(function(user:Express.User, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj:Express.User, cb) {
  cb(null, obj);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://ochko.website:${port}`);
});