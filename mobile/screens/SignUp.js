import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, KeyboardAvoidingView, View } from 'react-native';
import { Button, Icon, Text, Input, CheckBox } from '@rneui/themed';
import styles from '../project_files/styles/authStyles';
import ProfileForm from '../components/ProfileForm';
import axios from '../config/axios';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { SIGNUP_URL } from '../config/urls';
import Loader from '../project_files/components/Loader';
import Alert from '../project_files/components/Alert';

export default function SignUpScreen(props) {
  const { navigation } = props;

  const [location, setLocation] = useState(null);
  const [ErrorMsg, setErrorMsg] = useState(null);
  const [loading, setLoaing] = useState(false);
  const [alert, setAlert] = useState({
    title: '',
    message: '',
    type: '',
  });
  const [Visible, setVisible] = useState(false);

  //Get Locaton for user

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  //Post Data for Fais SignUp
  const _signUp = async values => {
    setLoaing(true);
    const body = {
      name: values.name,
      email: values.email,
      password: values.password,
      userType: values.userType ? 'doctor' : 'normal',
      specialization: values.specialization,
      wrkingHours: values.wrkingHours,
      address: values.address,
      phone: values.phone,
      location: {
        latitude: location ? location.latitude : null,
        longitude: location ? location.longitude : null,
      },
    };

    try {
      const respose = await axios.post(SIGNUP_URL,body);
      //console.log(respose);
      setLoaing(false);
      setAlert({
        title: 'تم إشاءالحساب',
        message: 'لقد تم أنشاء الحساب بنجاح , هل تريدالذهب الى صفحة تسجيل الدخول ',
        type: 'question',
      });
      setVisible(true);
    } catch (e) {
      console.log(e);
      setLoaing(false);
      setAlert({
        title: 'تنبه',
        message:e.message,
        type: 'alert',
      });
      setVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Loader title='جاري إنشاء حساب' loading={loading} />

      <Alert
        visible={Visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => {
          navigation.navigate('Home');
          setVisible(false);
        }}
        onClick={() => {
          navigation.navigate('Login');
          setVisible(false);
        }}
      />

      <View>
        <Icon raised name='user' type='font-awesome' color='#f50' size={60} />
        <Text h4>إنشاء حساب جديد</Text>
      </View>
      <KeyboardAvoidingView behavior='padding' enabled>
        <View style={styles.container}>
          <ProfileForm
            buttonTitle='تسجيل'
            checkBox={true}
            user={null}
            disabled={false}
            submit={(values => _signUp(values))}
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
