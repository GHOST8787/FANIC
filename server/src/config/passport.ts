import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// @ts-ignore
import { Strategy as LineStrategy } from 'passport-line';
import { UserModel } from '../models/User';

// Google OAuth 策略
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    // 查找或創建用戶
    let user = await UserModel.findByProviderId(profile.id, 'google');
    
    if (!user) {
      // 創建新用戶
      const userData = {
        name: profile.displayName || 'Unknown User',
        email: profile.emails?.[0]?.value || '',
        provider: 'google' as const,
        provider_id: profile.id,
        avatar_url: profile.photos?.[0]?.value
      };
      
      user = await UserModel.create(userData);
    }
    
    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
}));

// Facebook OAuth 策略
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID || '',
  clientSecret: process.env.FACEBOOK_APP_SECRET || '',
  callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails', 'photos']
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    // 查找或創建用戶
    let user = await UserModel.findByProviderId(profile.id, 'facebook');
    
    if (!user) {
      // 創建新用戶
      const userData = {
        name: profile.displayName || 'Unknown User',
        email: profile.emails?.[0]?.value || '',
        provider: 'facebook' as const,
        provider_id: profile.id,
        avatar_url: profile.photos?.[0]?.value
      };
      
      user = await UserModel.create(userData);
    }
    
    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
}));

// LINE OAuth 策略
passport.use(new LineStrategy({
  channelID: process.env.LINE_CHANNEL_ID || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
  callbackURL: 'http://localhost:5000/api/auth/line/callback',
  scope: ['profile', 'openid', 'email']
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    // 查找或創建用戶
    let user = await UserModel.findByProviderId(profile.id, 'line');
    
    if (!user) {
      // 創建新用戶
      const userData = {
        name: profile.displayName || 'Unknown User',
        email: profile.emails?.[0]?.value || '',
        provider: 'line' as const,
        provider_id: profile.id,
        avatar_url: profile.pictureUrl
      };
      
      user = await UserModel.create(userData);
    }
    
    return done(null, user);
  } catch (error) {
    return done(error as Error);
  }
}));

// 序列化用戶
passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

// 反序列化用戶
passport.deserializeUser(async (id: number, done: any) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport; 