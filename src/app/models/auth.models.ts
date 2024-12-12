export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    registrationDate: Date;
    fitnessLevel: string;
    trialExpiration: null;
    isDeleted: boolean;
}

export interface AuthResponse {
    success: boolean;
    user: UserProfile;
}

export interface UserProfile {
    userId: number;
    name: string;
    email: string;
    registrationDate: Date;
    fitnessLevel: string;
    trialExpiration: null;
    newProperty1?: string;
    newProperty2?: string;
}
