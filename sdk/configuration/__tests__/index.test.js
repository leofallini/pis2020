import {
  getParameters,
  setParameters,
  clearParameters,
  resetParameters,
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
      code: 'Code',
    };
    const parameters4 = {
      clientId: 'clientId2',
      code: '',
    };
    const parameters5 = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 123,
      idToken: 'idToken',
    };
    const parameters6 = {
      scope: 'Scope',
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
      code: 'Code',
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
      code: 'Code',
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
      code: 'Code',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 123,
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
      code: 'Code',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      tokenType: 'tokenType',
      expiresIn: 123,
      idToken: 'idToken',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
      state: '',
      scope: 'Scope',
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
});
