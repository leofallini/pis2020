// import { fetch } from 'react-native-ssl-pinning';
import { Platform } from 'react-native';
import { userInfoEndpoint } from '../utils/endpoints';
import { getParameters } from '../configuration';
import fetchWrapper from '../utils/fetchRetry';

const getUserInfo = async () => {
  let { accessToken } = getParameters();
  try {
    const response = await fetchWrapper(
      userInfoEndpoint,
      {
        method: 'GET',
        timeoutInterval: 10000,
        pkPinning: Platform.OS === 'ios',
        sslPinning: {
          certs: ['certificate'],
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        },
      },
      5,
    );
    const { status } = response;
    const responseJson = await response.json();

    // En caso de error se devuelve la respuesta,
    // rechazando la promesa.
    if (status !== 200) {
      return Promise.reject(responseJson);
    }

    // Resuelvo promesa con la información del usuario.
    return Promise.resolve(responseJson);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default getUserInfo;
