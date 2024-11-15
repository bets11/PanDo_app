import React from 'react';
import { StyleSheet, View, Alert} from 'react-native';
import Logo from '../components/login/logo';
import InputField from '../components/common/inputField';
import SubmitButton from '../components/common/submitButton';
import ForgotPassword from '../components/login/forgotPassword';
import SignupPrompt from '../components/login/signupPrompt';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    navigation.navigate('Overview');
  }


  return (
    <View style={styles.container}>
      <Logo />
      <InputField placeholder="E-Mail" value={email} onChangeText={setEmail} />
      <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <SubmitButton title="Login" onPress={handleLogin} backgroundColor='#000000' fontColor='#FFF' />
      <ForgotPassword />
      <SignupPrompt onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dffcbc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});