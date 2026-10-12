import { StatusBar } from 'expo-status-bar';
//React liaubres
import { StyleSheet, View, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Button, ListItem, Text, Avatar, SearchBar } from '@rneui/themed';
import TouchableScale from 'react-native-touchable-scale';
import React, { useState, useEffect } from 'react';
// auth liaubres
import AsyncStorage from '@react-native-async-storage/async-storage';
//components
import { DOCTOR_URL } from '../config/urls';
import Loader from '../project_files/components/Loader';
import styles from '../project_files/styles/authStyles';
import axios from '../config/axios';

import { transformName } from '../config/helpers';
import DoctorDetails from './DoctorDetails';

function DoctorScreen(props) {
  const [loading, setLoaing] = useState(false);
  const [Value, setValue] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [SelectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const timerId = setTimeout(() => {
      _GetDoctor(Value);
    }, 500);
    return () => clearTimeout(timerId);
  }, [Value]);

  const _GetDoctor = async query => {
    setLoaing(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      axios.defaults.headers.common.Authorization = `JWT ${token}`;
      const response = await axios.get(DOCTOR_URL,{ params: { q: query ? query : '' } });

      setDoctors(response.data);
      console.log(doctors);
      setLoaing(false);
    } catch (e) {
      console.log(e);
      setLoaing(false);
    }
  };

  const itemPressHandler = itemId => {
    setSelectedDoctor(doctors.find(doctor => doctor.id === itemId));
  };

  return (
    <View>
      <Loader loading={loading} title='جاري إحضار الأطباء' />
      <ScrollView>
        <DoctorDetails selectedDoctor={SelectedDoctor}
         closeModal={() => setSelectedDoctor(null)} />

        <KeyboardAvoidingView behavior='padding' enabled>
          <SearchBar
            placeholder='إبحث هنا...'
            containerStyle={{ backgroundColor: '#FBFBFB' }}
            inputContainerStyle={{ backgroundColor: '#E5E4EA' }}
            style={{ direction: 'rtl' }}
            value={Value}
            onChangeText={(text => setValue(text))}
            lightTheme
            round
          />

          <SafeAreaView>
            {doctors.length !== 0 ? (
              doctors.map((l,i) => {
                return l.profile ? (
                  <ListItem
                    key={i} // تعديل هنا لاستخدام معرف فريد
                    Component={TouchableScale}
                    friction={800}
                    tension={100}
                    activeScale={1.2}
                    onPress={(() => itemPressHandler(l.id))}
                    >
                    <Avatar
                      size={30}
                      rounded
                      title={transformName(l.name)}
                      containerStyle={{ backgroundColor: '#3d4db7' }}
                    />
                    <ListItem.Content>
                      <ListItem.Title>{l.name}</ListItem.Title>
                      <ListItem.Subtitle>{l.profile.specialization}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />  
                  </ListItem>  
                ) : (  
                  ''  
                );  
              })  
            ) : (  
              <Text style={styles.noDoctorsText}>لا  يوجد أطباء لعرضهم</Text>
            )}  
          </SafeAreaView>  
        </KeyboardAvoidingView>  
      </ScrollView>  
    </View>  
  );
}

export default DoctorScreen;
