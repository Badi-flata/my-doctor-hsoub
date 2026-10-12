import { View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text, Avatar, Overlay ,Icon} from '@rneui/themed';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import axios from '../config/axios';
import styles from '../project_files/styles/profileStyles';
import { SAVED_ME_DOCTOR, LIST_ME_DOCTORS , DELETE_ME_DOCTOR  } from '../config/urls';
import { transformName } from '../config/helpers';

function DoctorDetails({ selectedDoctor, closeModal ,onDoctorSaved}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // التحقق مما إذا كان الطبيب محفوظاً بالفعل
  useEffect(() => {
    if (selectedDoctor) {
      checkIfSaved();
    }
  }, [selectedDoctor]);
  
  const checkIfSaved = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      axios.defaults.headers.common.Authorization = `JWT ${token}`;
      const response = await axios.get(LIST_ME_DOCTORS);
      
      // التحقق مما إذا كان الطبيب موجوداً في القائمة
      const isAlreadySaved = response.data.some(doctor => doctor.id === selectedDoctor.id);
      setSaved(isAlreadySaved);
    } catch (error) {
      console.log('Error checking if doctor is saved:', error);
    }
  };
  const toggleFavorite = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        setSaving(false);
        return;
      }
      axios.defaults.headers.common.Authorization = `JWT ${token}`;
      
      if (saved) {
        // إزالة من المفضلة
        await axios.delete(`${DELETE_ME_DOCTOR}/${selectedDoctor.id}`);
      } else {
        // إضافة إلى المفضلة
        await axios.post(SAVED_ME_DOCTOR, { doctorId: selectedDoctor.id });
      }
      
      setSaved(!saved);
      setSaving(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  if (selectedDoctor) {
    return (
      <Overlay isVisible={selectedDoctor !== null} fullScreen>
        <View style={styles.container}>
          <View style={styles.userMetaContainer}>
            <Avatar
              size={40}
              rounded
              title={transformName(selectedDoctor.name)}
              containerStyles={{ backgroundColor: '#3d4db7' }}
            />
            <View style={styles.userMeta}>
              <Text>{selectedDoctor.name}</Text>
              <Text>{selectedDoctor.email}</Text>
            </View>

            <Icon
              name={saved ? 'heart' : 'heart-o'}
              type='font-awesome'
              color='#f50'
              
              onPress={toggleFavorite}
              disabled={saving}
            />
          </View>

          {selectedDoctor.profile &&(
          <View style={styles.doctorInfo}>
            <View style={styles.infoCell}>
              <Text style={styles.infoTitle}>الاختصاص</Text>
              <Text style={styles.infoTitle}>{selectedDoctor.profile.specialization}</Text>
            </View>

            <View style={styles.infoCell}>
              <Text style={styles.infoTitle}>العنوان</Text>
              <Text style={styles.infoTitle}>{selectedDoctor.profile.address}</Text>
            </View>

            <View style={styles.infoCell}>
              <Text style={styles.infoTitle}>ساعات العمل</Text>
              <Text style={styles.infoTitle}>{selectedDoctor.profile.wrkingHours}</Text>
            </View>

            <View style={styles.lastCell}>
              <Text style={styles.infoTitle}>رقم الهاتف</Text>
              <Text style={styles.infoTitle}>{selectedDoctor.profile.phone}</Text>
            </View>
          </View>)
            }
            
          {/* {selectedDoctor.latitude && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                provider='google'
                initialRegion={{
                  latitude: selectedDoctor.latitude,
                  longitude: selectedDoctor.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                {Platform.OS == 'web' ? (
                  <MapView.Marker
                    coordinate={{
                      latitude: selectedDoctor.latitude,
                      longitude: selectedDoctor.longitude,
                    }}
                  />
                ) : (
                  <Marker
                    coordinate={{
                      latitude: selectedDoctor.latitude,
                      longitude: selectedDoctor.longitude,
                    }}
                  />
                )}
              </MapView>
            </View>
          )} */}

          <Button title='عودة' style={{ marginTop: '50px' }} onPress={closeModal} />
        </View>
      </Overlay>
    );
  }
}

export default DoctorDetails;
