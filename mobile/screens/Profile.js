import { ScrollView, View } from 'react-native';
import { Text, Input, Icon, Button ,ListItem,
  Avatar} from '@rneui/themed';
import { useEffect, useState } from 'react';
import styles from '../project_files/styles/profileStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TouchableScale from 'react-native-touchable-scale';
//Relations
import axios from '../config/axios';
import { DELETE_PROFILE_URL, PROFILE_URL,LIST_ME_DOCTORS } from '../config/urls';
//componets
import Alert from '../project_files/components/Alert';
import Loader from '../project_files/components/Loader';
import DoctorDetails from './DoctorDetails';
import { transformName } from '../config/helpers';

function ProfileScreen(props) {
  const { navigation } = props;

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(false);
  const [savedDoctors, setSavedDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [alert, setAlert] = useState({
    title: '',
    message: '',
    type: '',
  });

  useEffect(() => {
    _GetProfiles();
    _GetSavedDoctors()
  }, []);

  const _GetProfiles = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      axios.defaults.headers.common.Authorization = `JWT ${token}`;
      const respose = await axios.get(PROFILE_URL);
      setUser(respose.data);
      console.log(respose.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setAlert({
        title: 'تنبه',
        message: e.response.data,
        type: 'alert',
      });
      setVisible(true);
    }
  };

   {/* بيانات الاطباء المحفظين*/}
  const _GetSavedDoctors = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      axios.defaults.headers.common.Authorization = `JWT ${token}`;
      const response = await axios.get(LIST_ME_DOCTORS);
      setSavedDoctors(response.data);
      console.log(response);
    } catch (e) {
      console.log('Error fetching saved doctors:', e);
    }
  };

  const itemPressHandler = itemId => {
    setSelectedDoctor(savedDoctors.find(l => l.id === itemId));
  };
 {/* حذف \تسجيل الخرج */}
  const handleAction = async () => {
    try {
      if (alert.type == 'delete') {
        const token = await AsyncStorage.getItem('accessToken');
        axios.defaults.headers.common.Authorization = `JWT ${token}`;
        const respose = await axios.delete(DELETE_PROFILE_URL);
        console.log(respose);
        setAlert({
          title: 'تنبه',
          message: respose.data.message,
          type: 'alert',
        });
        setVisible(true);
      }
      await AsyncStorage.clear();
      props.navigation.navigate('Home');
    } catch (e) {
      console.log(e);
      setAlert({
        title: 'تنبه',
        message:e.response.data.message,
        type: 'alert',
      });
      setVisible(true);
    }
  };

  const showAlert = (title, message, type) => {
    setAlert({
      title: title,
      message: message,
      type: type,
    });
    setVisible(true);
  };

  const confirm = type => {
    showAlert(
      type == 'delete' ? ' حذف حسابك' : 'تسجيل الخروج',
      type == 'delete' ? 'انت على وشك حذف حسابك' : 'اتريد تسجيل الخروج؟',
      type
    );
  };

  const handleConfirm = async () => {
    setVisible(false);
    await handleAction();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Loader loading={loading} />
        <Alert
          visible={visible}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onClick={handleConfirm}
          onClose={() => setVisible(false)}
        />
         {/*عرض بيانات الاطباء المعرضين */}
        <DoctorDetails
          selectedDoctor={selectedDoctor}
          closeModal={() => setSelectedDoctor(null)}
          onDoctorSaved={_GetSavedDoctors}/>

              {/* بيانات المستخدم*/}
        {user && 
          <>
            <View style={styles.userIconContainer}>
              <View style={styles.userMetaContainer}>
                <View style={styles.userAvtar}>
                  <Text style={styles.userAvtarText}>{transformName(user.name)}</Text>
                </View>
                <View style={styles.userMeta}>
                  <Text>{user.name}</Text>
                  <Text>{user.email}</Text>
                </View>
              </View>

              <View style={styles.iconsConatiner}>
                <Icon name='edit'
                 type='font-awesome'
                  color='#f50'
                   style={{ marginLeft: '5px' }} 
                   onPress={()=> navigation.navigate('UpdateProfile')}
                   />
                <Icon
                  name='trash'
                  type='font-awesome'
                  color='#f50'
                  onPress={() => confirm('delete')}
                />
              </View>
            </View>

            {user.profile && (
              <View style={{ marginBottom: '50px' }}>
                <View style={styles.doctorInfo}>
                  <View style={styles.infoCell}>
                    <Text style={styles.infoTitle}>الأختصاص</Text>
                    <Text style={styles.infoTitle}>{user.profile.specialization}</Text>
                  </View>

                  <View style={styles.infoCell}>
                    <Text style={styles.infoTitle}>النوان</Text>
                    <Text style={styles.infoTitle}>{user.profile.address}</Text>
                  </View>

                  <View style={styles.infoCell}>
                    <Text style={styles.infoTitle}>ساعات العمل</Text>
                    <Text style={styles.infoTitle}>{user.profile.wrkingHours}</Text>
                  </View>

                  <View style={styles.infoCell}>
                    <Text style={styles.infoTitle}>الرقم</Text>
                    <Text style={styles.infoTitle}>{user.profile.phone}</Text>
                  </View>
                </View>
              </View>
            )}

      {/* قائمة الأطباء المحفوظين */}
     {savedDoctors.length > 0 ? (
              <View style={{ marginBottom: 30 }}>
                <Text h4 style={{ textAlign: 'center', marginBottom: 15, marginTop: 20 }}>الأطباء المحفوظين</Text>
                {savedDoctors.map((l, i) => (
                  <ListItem
                    key={i}
                    Component={TouchableScale}
                    friction={800}
                    tension={100}
                    activeScale={1.2}
                    onPress={() => itemPressHandler(l.id)}
                    bottomDivider
                  >
                    <Avatar
                      size={30}
                      rounded
                      title={transformName(l.name)}
                      containerStyle={{ backgroundColor: '#3d4db7' }}
                    />
                    <ListItem.Content>
                      <ListItem.Title>{l.name}</ListItem.Title>
                      {user.userType=='normal'? 
                      <ListItem.Subtitle>{l.profile.specialization}</ListItem.Subtitle> 
                      : <ListItem.Subtitle>{l.email}</ListItem.Subtitle>
                      }
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                ))}
              </View>
            ) : (
              <View style={{ marginBottom: 30, marginTop: 20 }}>
                <Text h4 style={{ textAlign: 'center', marginBottom: 15 }}>الأطباء المحفوظين</Text>
                <Text style={{ textAlign: 'center' }}>لا يوجد أطباء محفوظين حالياً</Text>
              </View>
            )}


            <Button
              buttonStyle={styles.logoutButton}
              title='تسجيل الخروج'
              onPress={() => confirm('logout')}
            />
          </>
        }
      </View>
    </ScrollView>
  );
}

export default ProfileScreen;
