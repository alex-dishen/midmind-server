export type SignInInput = {
  email: string;
  password: string;
};

export type TokensOutput = {
  access_token: string;
  refresh_token: string;
};

export type SignUpInput = {
  email: string;
  avatar?: string;
  password: string;
  last_name: string;
  first_name: string;
  confirmation_password: string;
};

export interface IAuthService {
  signIn(data: SignInInput): Promise<TokensOutput>;
  signUp(data: SignUpInput): Promise<TokensOutput>;
  signInWithGoogle(code: string): Promise<TokensOutput>;
  refreshAccessToken(userId: string, refreshToken?: string): Promise<TokensOutput>;
  logout(userId: string, refreshToken: string): Promise<void>;
}
