"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
// @ts-ignore
const passport_line_1 = require("passport-line");
const User_1 = require("../models/User");
// Google OAuth 策略
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // 查找或創建用戶
        let user = await User_1.UserModel.findByProviderId(profile.id, 'google');
        if (!user) {
            // 創建新用戶
            const userData = {
                name: profile.displayName || 'Unknown User',
                email: profile.emails?.[0]?.value || '',
                provider: 'google',
                provider_id: profile.id,
                avatar_url: profile.photos?.[0]?.value
            };
            user = await User_1.UserModel.create(userData);
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
// Facebook OAuth 策略
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_APP_ID || '',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '',
    callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // 查找或創建用戶
        let user = await User_1.UserModel.findByProviderId(profile.id, 'facebook');
        if (!user) {
            // 創建新用戶
            const userData = {
                name: profile.displayName || 'Unknown User',
                email: profile.emails?.[0]?.value || '',
                provider: 'facebook',
                provider_id: profile.id,
                avatar_url: profile.photos?.[0]?.value
            };
            user = await User_1.UserModel.create(userData);
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
// LINE OAuth 策略
passport_1.default.use(new passport_line_1.Strategy({
    channelID: process.env.LINE_CHANNEL_ID || '',
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
    callbackURL: 'http://localhost:5000/api/auth/line/callback',
    scope: ['profile', 'openid', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // 查找或創建用戶
        let user = await User_1.UserModel.findByProviderId(profile.id, 'line');
        if (!user) {
            // 創建新用戶
            const userData = {
                name: profile.displayName || 'Unknown User',
                email: profile.emails?.[0]?.value || '',
                provider: 'line',
                provider_id: profile.id,
                avatar_url: profile.pictureUrl
            };
            user = await User_1.UserModel.create(userData);
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
// 序列化用戶
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
// 反序列化用戶
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.UserModel.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map