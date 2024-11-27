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
    newProperty1?: string;
    newProperty2?: string;
}

export interface AuthResponse {
    success: boolean;
    user: UserProfile;
}

export interface UserProfile {
    name: string;
    email: string;
    registrationDate: Date;
    fitnessLevel: string;
    trialExpiration: null;
    newProperty1?: string;
    newProperty2?: string;
}
