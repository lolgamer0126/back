"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth_1 = __importDefault(require("passport-google-oauth"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const restaurant_1 = __importDefault(require("./routes/restaurant"));
dotenv_1.default.config();
const GOOGLE_CLIENT_ID = '411255982749-uem7h7b4j3h8ngone58qs2dnlcvejrql.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GoogleOauth = passport_google_oauth_1.default.OAuth2Strategy;
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: '*'
}));
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
    cookie: {
        secure: false,
        httpOnly: false
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new GoogleOauth({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://ochko.website:8000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    const userProfile = profile;
    return done(null, userProfile);
}));
app.use('/auth', auth_1.default);
app.use('/restaurant', restaurant_1.default);
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://ochko.website:${port}`);
});
