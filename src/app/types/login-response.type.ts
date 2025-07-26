export type LoginResponse = {
    token: string,
    name: string
    role: 'user' | 'admin';

}