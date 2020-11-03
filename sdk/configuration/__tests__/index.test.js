import {
  getParameters,
  setParameters,
  clearParameters,
  resetParameters,
  eraseCode,
} from '../index';

describe('configuration module', () => {
  it('works correctly', () => {
    const parameters1 = {
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: '',
      state: '',
      scope: '',
    };
    const parameters2 = {
      redirectUri: 'redirectUri',
      clientSecret: 'clientSecret',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    };
    const parameters3 = {
      clientId: 'clientId',
      code: 'code',
    };
    const parameters4 = {
      clientId: 'clientId2',
      code: '',
    };
    const parameters5 = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 'expiresIn',
      idToken: 'idToken',
    };
    const parameters6 = {
      scope: 'scope',
    };
    const parameters = getParameters();
    expect(parameters).toStrictEqual(parameters1);
    setParameters(parameters2);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: '',
      clientSecret: 'clientSecret',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      state: '',
      scope: '',
    });
    setParameters(parameters3);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      code: 'code',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      state: '',
      scope: '',
    });
    setParameters(parameters4);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId2',
      clientSecret: 'clientSecret',
      // code: 'code',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      state: '',
      scope: '',
    });
    setParameters(parameters5);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId2',
      clientSecret: 'clientSecret',
      // code: 'code',
      code: '',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 'expiresIn',
      idToken: 'idToken',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      state: '',
      scope: '',
    });
    setParameters(parameters6);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId2',
      clientSecret: 'clientSecret',
      // code: 'code',
      code: '',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 'expiresIn',
      idToken: 'idToken',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      state: '',
      scope: 'scope',
    });
    clearParameters();
    expect(getParameters()).toStrictEqual({
      redirectUri: 'redirectUri',
      clientId: 'clientId2',
      clientSecret: 'clientSecret',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      state: '',
      scope: '',
    });
    resetParameters();
    expect(getParameters()).toStrictEqual({
      redirectUri: '',
      clientId: '',
      clientSecret: '',
      code: '',
      accessToken: '',
      refreshToken: '',
      tokenType: '',
      expiresIn: '',
      idToken: '',
      postLogoutRedirectUri: '',
      state: '',
      scope: '',
    });
  });
  it('eraseCode works correctly', () => {
    const parameters7 = {
      redirectUri: 'as',
      clientId: 'as',
      clientSecret: 'as',
      code: 'as',
      accessToken: 'as',
      refreshToken: 'as',
      tokenType: 'as',
      expiresIn: 'as',
      idToken: 'as',
      postLogoutRedirectUri: 'as',
      state: 'as',
      scope: 'as',
    };
    setParameters(parameters7);
    expect(getParameters()).toStrictEqual({
      redirectUri: 'as',
      clientId: 'as',
      clientSecret: 'as',
      code: 'as',
      accessToken: 'as',
      refreshToken: 'as',
      tokenType: 'as',
      expiresIn: 'as',
      idToken: 'as',
      postLogoutRedirectUri: 'as',
      state: 'as',
      scope: 'as',
    });
    eraseCode();
    expect(getParameters()).toStrictEqual({
      redirectUri: 'as',
      clientId: 'as',
      clientSecret: 'as',
      code: '',
      accessToken: 'as',
      refreshToken: 'as',
      tokenType: 'as',
      expiresIn: 'as',
      idToken: 'as',
      postLogoutRedirectUri: 'as',
      state: 'as',
      scope: 'as',
    });
  });
});
