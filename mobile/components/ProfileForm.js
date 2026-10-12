import { Formik } from 'formik';
import * as yup from 'yup';
import styles from '../project_files/styles/authStyles';
import { Text, Input, CheckBox, Button } from '@rneui/themed';
//import MapViewContainer from './MapViewComponent';

export default function ProfileForm(props) {
  //
  const validationSchema = yup.object().shape({
    name: yup.string().required('السم مطلوب'),

    email: yup
      .string()
      .email('يجب ان تكون البريد الإكتروني صحيح')
      .required('البريد الإلكتروني مطلوب'),

    password: yup
      .string()
      .min(5, 'يجب ان تكون كلمة المرور من خمس حروف')
      .required('يجب عليك إدخال كلمة مرور صالحة'),
    // port doctor
    userType: yup.boolean(),

    specialization: yup.string().when('userType', {
      is: true,
      then: schema => schema.required('يجب عليك ادخال التخصص'),
    }),

    wrkingHours: yup.string().when('userType', {
      is: true,
      then: schema => schema.required('يجب عليك إدخال ساعات العمل'),
    }),

    address: yup.string().when('userType', {
      is: true,
      then: schema => schema.required('يجب عليك إدخال العنوان'),
    }),

    phone: yup.string().when('userType', {
      is: true,
      then: schema => schema.required('يجب عليك إدخال  رقم الهاتف'),
    }),
  });
  //
  return (
    <Formik
      initialValues={{
        name: props.user?.name || '',
        email: props.user?.email || '',
        password: '',
        userType: props.user?.userType == 'doctor',
        specialization: props.user?.profile?.specialization || '',
        wrkingHours: props.user?.profile?.wrkingHours || '',
        address: props.user?.profile?.address || '',
        phone: props.user?.profile?.phone || '',
        latitude: props.user?.latitude || null,
        longitude: props.user?.longitude || null,
      }}
      validationSchema={validationSchema}
      onSubmit={values => props.submit(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, values, setFieldValue, isValid }) => (
        <>
          <Input
            name='name'
            placeholder='الاسم'
            value={values.name}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            style={[styles.textInput, errors.name && styles.errorInput]}
          />
          {errors.name && (
            <Text p style={styles.textError}>
              {errors.name}
            </Text>
          )}
          <Input
            name='email'
            value={values.email}
            disabled={props.disabled}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            keyboardType='email-address'
            placeholder='البريد الألكتروني'
            style={[styles.textInput, errors.email && styles.errorInput]}
          />

          {errors.email && (
            <Text p style={styles.textError}>
              {errors.email}
            </Text>
          )}

          <Input
            name='password'
            secureTextEntry
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            placeholder='كلمة المرور'
            style={[styles.textInput, errors.password && styles.errorInput]}
          />

          {errors.password && (
            <Text p style={styles.textError}>
              {errors.password}
            </Text>
          )}

          {props.checkBox && (
            <CheckBox
              title='أنا طبيب'
              checked={values.userType}
              name='userType'
              onPress={() => setFieldValue('userType', !values.userType)}
            />
          )}
      
          {values.userType && (
            <>
              <Input
                name='specialization'
                onChangeText={handleChange('specialization')}
                onBlur={handleBlur('specialization')}
                value={values.specialization}
                placeholder='التخصص'
                style={[styles.textInput, errors.specialization && styles.errorInput]}
              />
              {errors.specialization && (
                <Text p style={styles.textError}>
                  {errors.specialization}
                </Text>
              )}
              <Input
                name='wrkingHours'
                onChangeText={handleChange('wrkingHours')}
                onBlur={handleBlur('wrkingHours')}
                value={values.wrkingHours}
                placeholder='ساعات العمل'
                style={[styles.textInput, errors.wrkingHours && styles.errorInput]}
              />
              {errors.wrkingHours && (
                <Text p style={styles.textError}>
                  {errors.wrkingHours}
                </Text>
              )}
              <Input
                name='address'
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                placeholder='العنوان'
                style={[styles.textInput, errors.address && styles.errorInput]}
              />
              {errors.address && (
                <Text p style={styles.textError}>
                  {errors.address}
                </Text>
              )}
              <Input
                name='phone'
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                placeholder='رقم الهاتف'
                style={[styles.textInput, errors.phone && styles.errorInput]}
              />
              {errors.phone && (
                <Text p style={styles.textError}>
                  {errors.phone}
                </Text>
              )}
            </>
          )}
          <Button
            title={props.buttonTitle}
            style={{ marginTop: '20px' }}
            onPress={handleSubmit}
            disabled={!isValid}
          />
        </>
      )}
    </Formik>
  );
}
