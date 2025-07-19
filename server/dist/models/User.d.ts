export interface User {
    id: number;
    name: string;
    email: string;
    provider: 'google' | 'facebook' | 'line';
    provider_id?: string;
    avatar_url?: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateUserData {
    name: string;
    email: string;
    provider: 'google' | 'facebook' | 'line';
    provider_id?: string;
    avatar_url?: string;
}
export declare class UserModel {
    static findByEmailAndProvider(email: string, provider: string): Promise<User | null>;
    static findByProviderId(providerId: string, provider: string): Promise<User | null>;
    static create(userData: CreateUserData): Promise<User>;
    static update(id: number, userData: Partial<CreateUserData>): Promise<User | null>;
    static findById(id: number): Promise<User | null>;
}
//# sourceMappingURL=User.d.ts.map