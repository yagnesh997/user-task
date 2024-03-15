import express from 'express'
import httpStatus from 'http-status'
import cors from 'cors';
import routes from './routes/v1/Index';
import config from './config/Index';
import { errorConverter, errorHandler } from './middlewares/Error';
import ApiError from './utils/ApiError';
import morgan from './config/Morgan';
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook'
import AuthService from './services/AuthService';

const app = express();

if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors({ origin: true }));
app.options('*', cors());

// v1 api routes
app.use('', routes);

// send back a 404 error for any unknown api request
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((_: any, __: any, next: (arg0: any) => void) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: config.google_client_id,
    clientSecret: config.google_client_secret,
    callbackURL: 'http://localhost:4000/auth/google/callback'
}, async (_accessToken, _refreshToken, profile, done) => {
    await AuthService.authgoogleuser(profile.id, profile.displayName)
    return done(null, profile);
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: config.facebook_client_id,
    clientSecret: config.facebook_client_secret,
    callbackURL: 'http://localhost:4000/auth/facebook/callback'
}, async (_accessToken, _refreshToken, profile, done) => {
    await AuthService.authfacebookuser(profile.id, profile.displayName)
    return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

export default app;
