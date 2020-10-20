/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// istanbul ignore file
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import {
  login,
  logout,
  getParameters,
  getToken,
  getUserInfo,
  refreshToken,
} from 'sdk-gubuy-test';

import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';

const LoginButton = ({ handleCode }) => {
  const handleButton = async () => {
    const parameters = getParameters();
    if (parameters.code === '') await handleLogin();
    else {
      await handleLogout();
      handleCode(null);
    }
  };
  const handleLogin = async () => {
    try {
      const code = await login();
      handleCode(code);
    } catch (err) {
      console.log(err);
      const parameters = getParameters();
      console.log(parameters);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleButton}>
      <View style={styles.buttonSeparator}>
        <Image source={LogoAgesicSimple} style={styles.buttonLogo} />
      </View>
      <Text style={styles.buttonText}>Login con USUARIO gub.uy</Text>
    </TouchableOpacity>
  );
};

LoginButton.propTypes = {
  handleCode: PropTypes.func.isRequired,
};

export default LoginButton;
