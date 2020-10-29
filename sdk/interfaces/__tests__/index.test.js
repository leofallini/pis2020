import { initialize } from '../index';
import { getParameters, resetParameters } from '../../configuration';
import { ERRORS } from '../../utils/constants';

jest.mock('../../requests');
afterEach(() => jest.clearAllMocks());
beforeEach(() => resetParameters());

const mockAddEventListener = jest.fn();
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
}));

describe('initialize', () => {
  it('works correctly', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    };
    const errorResp = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.postLogoutRedirectUri,
    );
    expect(errorResp.message).toMatchObject(ERRORS.NO_ERROR);
    const responseParameters = getParameters();
    expect(responseParameters.redirectUri).toStrictEqual(
      parameters.redirectUri,
    );
    expect(responseParameters.clientId).toStrictEqual(parameters.clientId);
    expect(responseParameters.clientSecret).toStrictEqual(
      parameters.clientSecret,
    );
    expect(responseParameters.postLogoutRedirectUri).toStrictEqual(
      parameters.postLogoutRedirectUri,
    );
  });

  it('returns error when clientId is empty', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: '',
      clientSecret: 'clientSecret',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    };
    const errorResp = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.postLogoutRedirectUri,
    );
    expect(errorResp).toMatchObject(ERRORS.INVALID_CLIENT_ID);
    const responseParameters = getParameters();
    // Serán vacíos ya que no se setean
    expect(responseParameters.redirectUri).toStrictEqual('');
    expect(responseParameters.clientId).toStrictEqual('');
    expect(responseParameters.clientSecret).toStrictEqual('');
    expect(responseParameters.postLogoutRedirectUri).toStrictEqual('');
  });

  it('returns error when redirectUri is empty', () => {
    const parameters = {
      redirectUri: '',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      postLogoutRedirectUri: 'postLogoutRedirectUri',
    };
    const errorResp = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.postLogoutRedirectUri,
    );
    expect(errorResp).toMatchObject(ERRORS.INVALID_REDIRECT_URI);
    const responseParameters = getParameters();
    // Serán vacíos ya que no se setean
    expect(responseParameters.redirectUri).toStrictEqual('');
    expect(responseParameters.clientId).toStrictEqual('');
    expect(responseParameters.clientSecret).toStrictEqual('');
    expect(responseParameters.postLogoutRedirectUri).toStrictEqual('');
  });

  it('returns error when postLogoutRedirectUri is empty', () => {
    const parameters = {
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      postLogoutRedirectUri: '',
    };
    const errorResp = initialize(
      parameters.redirectUri,
      parameters.clientId,
      parameters.clientSecret,
      parameters.postLogoutRedirectUri,
    );
    expect(errorResp).toMatchObject(
      ERRORS.INVALID_POST_LOGOUT_REDIRECT_URI,
    );
    const responseParameters = getParameters();
    // Serán vacíos ya que no se setean
    expect(responseParameters.redirectUri).toStrictEqual('');
    expect(responseParameters.clientId).toStrictEqual('');
    expect(responseParameters.clientSecret).toStrictEqual('');
    expect(responseParameters.postLogoutRedirectUri).toStrictEqual('');
  });
});
