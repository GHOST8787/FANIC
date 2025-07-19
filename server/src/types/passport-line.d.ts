declare module 'passport-line' {
  import { Strategy } from 'passport';
  
  interface LineStrategyOptions {
    channelID: string;
    channelSecret: string;
    callbackURL: string;
    scope?: string[];
  }
  
  interface LineProfile {
    id: string;
    displayName: string;
    pictureUrl?: string;
    emails?: Array<{ value: string }>;
  }
  
  class LineStrategy extends Strategy {
    constructor(options: LineStrategyOptions, verify: (
      accessToken: string,
      refreshToken: string,
      profile: LineProfile,
      done: (error: any, user?: any) => void
    ) => void);
  }
  
  export { LineStrategy as Strategy };
} 