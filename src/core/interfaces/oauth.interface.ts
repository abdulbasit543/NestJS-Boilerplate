export type OAuthProviders = 'google' | 'apple';

export type IOAuthTokenData = {
    id: string;
    type: 'google' | 'apple';
    email: string;
};

export default interface IOAuth {
    GetTokenData(token: string): Promise<IOAuthTokenData>;
}
