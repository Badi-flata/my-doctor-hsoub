import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import styles from '../project_files/styles/authStyles';
import ProfileForm from '../components/ProfileForm';

import { Text, Input, Icon, Button } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { PROFILE_URL ,UPDATE_PROFILE_URL} from '../config/urls';
import Loader from '../project_files/components/Loader';
import Alert from '../project_files/components/Alert';
import axios from '../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function UpdateProfileScreen(props) {
    const { navigation } = props;
  
    const [User, setUser] = useState(false);
   
    const [loading, setLoaing] = useState(false);
    const [alert, setAlert] = useState({
      title: '',
      message: '',
      type: '',
    });
    const [Visible, setVisible] = useState(false);
  
  useEffect(() => {
    _getProflie();
  },[])

    const _getProflie = async () => {
      setLoaing(true);
      try {
            const token= await AsyncStorage.getItem('accessToken');
            axios.defaults.headers.common.Authorization = `JWT ${token}`;
            const respose = await axios.get(PROFILE_URL);
        setUser(respose.data);
        console.log(User)
        setLoaing(false);
      } catch (e) {
        console.log(e);
        setLoaing(false);
        setAlert({
          title: 'تنبه',
          message:e.response.data.message,
          type:'alert',
        });
        setVisible(true);
      }
    };



    const _updateProflie = async (values) => {
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
          latitude: values.latitude || null,
          longitude: values.longitude || null
        },
    }
        try{
            const respose = await axios.put(UPDATE_PROFILE_URL,body);
            setLoaing(false);
            setAlert({
                title: 'تم تحديث البيانات ',
                message: ' لقد تم تحديث بيانتك بنجاح , هل تريدالذهب الى صفحتك الشخصيه ',
                type: 'question',
              });
            setVisible(true);
          }catch(e){
            setLoaing(false);
            setAlert({
              title: 'تنبه',
              message:e.response.data.message,
              type: 'alert',
            });
            setVisible(true);
        }
        } 

    return (
      <ScrollView>
        <Loader title='جاري تحديث البيانات' loading={loading} />
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
        {/* Inputs */}
            {User &&
            <> 
        <View style={styles.container}>
          <Icon raised name='user'
          type='font-awesome'
           color='#f50' 
           size={50} />
          <Text h4> تحديث البيانات </Text>
        </View>
        <KeyboardAvoidingView behavior='padding' enabled>
          <View style={styles.container}>
              <ProfileForm 
                user={User} 
                disabled={true}
                checkBox={false}
                buttonTitle='تحديث البيانات'
                submit={(values => _updateProflie(values))}
                />
          </View>
          </KeyboardAvoidingView>
              </>
              }
      </ScrollView>
    );
  }