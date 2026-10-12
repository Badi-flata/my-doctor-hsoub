import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useState, useEffect } from 'react';
import styles from '../project_files/styles/homeStyles';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen(props) {
  const { navigation } = props;

  const [token, setToken] = useState('');

  useEffect(() => {
const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused, do something here
      _CheckToken();
    })
  return unsubscribe;
  }, [navigation]);

  const _CheckToken = async () => {
    const Token = await AsyncStorage.getItem('accessToken');
    setToken(Token);
  };

  return (
    <ImageBackground
      source={require('../project_files/images/doc-bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>أهلا في بك تطبيق طبيبي</Text>
        <Text style={styles.text}>التطبيق الاول للربط بين الأطباء والمرضى</Text>
        {token ? (
          <>
            <Button title='استعرض قائمةالأطباء' onPress={() => navigation.navigate('Doctors')} />
            <Button
              type='clear'
              title=' وجهات المستخدم'
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.labelButton}>استعرص الملف الشخصي</Text>
            </Button>
          </>
        ) : (
          <>
            <Button title='إنشاء حساب جديد' 
            onPress={() => navigation.navigate('SignUp')} />
            <Button
              type='clear'
              title=' تسجيل الدخول'
              onPress={() => navigation.navigate('Login')}
            ></Button>
          </>
        )}
      </View>
    </ImageBackground>
  );
}
