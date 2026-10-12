import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import styles from '../project_files/styles/authStyles';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Text, Input, Icon, Button } from '@rneui/themed';
import { useState } from 'react';
import { LOGIN_URL } from '../config/urls';
import Loader from '../project_files/components/Loader';
import Alert from '../project_files/components/Alert';
import axios from '../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen(props) {
  const { navigation } = props;

  const LoginValidationSchema = yup.object().shape({
    email: yup.string().email('يجب إدخال بريد  إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
    password: yup
      .string()
      .required('يجب عليك إدخال كلمة مرور صالحة')
      .min(5, 'يجب أن تكون كلمة المرور أكثر من خمسة محارف'),
  });

  const [location, setLocation] = useState(null);
  const [ErrorMsg, setErrorMsg] = useState(null);
  const [loading, setLoaing] = useState(false);
  const [alert, setAlert] = useState({
    title: '',
    message: '',
    type: '',
  });
  const [Visible, setVisible] = useState(false);

  const _login = async values => {
    setLoaing(true);
    const body = {
      email: values.email,
      password: values.password,
    };

    try {
      const respose = await axios.post(LOGIN_URL,body);
      AsyncStorage.setItem('accessToken', respose.data.accessToken);
      setLoaing(false);
      setAlert({
        title: 'تم تسجيل الدخول بنجاح',
        message: ' لقد تم تسجيل الدخول بنجاح , هل تريدالذهب الى صفحتك الشخصيه ',
        type: 'question',
      });
      setVisible(true);
    } catch (e) {
      console.log(e);
      setLoaing(false);
      setAlert({
        title: 'تنبه',
        message: e.response.data.message,
        type: 'alert',
      });
      setVisible(true);
    }
  };

  return (
    <ScrollView>
      <Loader title='جاري تسجيل الدخول' loading={loading} />
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
          navigation.navigate('Profile');
          setVisible(false);
        }}
      />

      <View style={styles.container}>
        <Icon raised name='user' type='font-awesome' color='#f50' size={50} />
        <Text h4>تسجيل الدخول</Text>
      </View>

      <KeyboardAvoidingView behavior='padding' enabled>
        <View style={styles.container}>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginValidationSchema}
            onSubmit={values => _login(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              values,
              setFieldValue,
              isValid,
            }) => (
              <>
                <Input
                  name='email'
                  onChangeText={handleChange('email')}
                  disabled={props.disabled}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType='email-address'
                  placeholder='البريد الإلكتروني'
                  style={[styles.textInput, errors.email && styles.errorInput]}
                />
                {errors.email && (
                  <Text p style={styles.textError}>
                    {errors.email}
                  </Text>
                )}
                <Input
                  name='password'
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  placeholder='كلمة المرور'
                  style={[styles.textInput, errors.password && styles.errorInput]}
                />
                {errors.password && (
                  <Text p style={styles.textError}>
                    {errors.password}
                  </Text>
                )}

                <Button
                  title={'تسجيل '}
                  style={{ marginTop: '20px' }}
                  onPress={handleSubmit}
                  disabled={!isValid}
                />
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
