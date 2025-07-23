import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';
import MenuItem from '../components/MenuItem';
import { RootStackNavigationProp } from './types';

function UserMenuScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const onLogin = () => {
    navigation.navigate('Login');
  };
  const onRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View>
      <MenuItem name="Login" onPress={onLogin} />
      <MenuItem name="Register" onPress={onRegister} />
    </View>
  );
}
export default UserMenuScreen;
