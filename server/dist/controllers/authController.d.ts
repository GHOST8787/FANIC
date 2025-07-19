import { Request, Response } from 'express';
export declare class AuthController {
    private static generateToken;
    static handleOAuthSuccess(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static handleOAuthFailure(req: Request, res: Response): void;
    static checkAuthStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static logout(req: Request, res: Response): void;
}
//# sourceMappingURL=authController.d.ts.map