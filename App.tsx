import { useContext, useEffect } from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthContextProvider, { AuthContext } from './store/context/authContext';
import AlertContextProvider, { AlertContext } from './store/context/alertContext';
import AboutContextProvider, { AboutContext } from './store/context/aboutContext';
import Colors from './utils/Colors';
import HomeScreen from './screens/Home';
import FormScreen from './screens/Form';
import SigninScreen from './screens/Signin';
import SignupScreen from './screens/Signup';
import DetailScreen from './screens/Detail';
import ProfileScreen from './screens/Profile';
import is24Hours from './utils/is24Hours';
import Avatar from './components/Avatar';
import UserScreen from './screens/User';
import EditScreen from './screens/Edit';
import FlatButton from './components/FlatBtn';

type RootStackParamList = {
  Index: undefined,
  Signin: undefined,
  Signup: undefined,
  Detail: { id: string },
  User: { id: string },
  Edit: { id: string },
}

type RootTabStackParamList = {
  Home: undefined,
  Form: undefined,
  Auth: undefined,
  Profile: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<RootTabStackParamList>();

const RootStackNavigation = () => {
  const { visibleToggle } = useContext(AboutContext);

  return (
    <Stack.Navigator screenOptions={{
      headerRight: () => (
        <FlatButton title='About' onPress={visibleToggle} />
      ),
    }}>
      <Stack.Screen name="Index" component={RootTabNavigation} options={{
        headerShown: false,
      }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{
        title: 'Explore',
      }} />
      <Stack.Screen name='User' component={UserScreen} />
      <Stack.Screen name="Edit" component={EditScreen} options={{
        title: 'Edit Post'
      }} />
    </Stack.Navigator>
  )
}

const RootTabNavigation = () => {
  const { user, isAuth } = useContext(AuthContext);
  const { visibleToggle } = useContext(AboutContext);

  return (
    <Tabs.Navigator screenOptions={{
      headerRight: () => (
        <FlatButton title='About' onPress={visibleToggle} style={styles.aboutBtn} />
      ),
      tabBarShowLabel: false,
      tabBarActiveTintColor: Colors.sky400,
      tabBarInactiveTintColor: Colors.gray300,
    }}>
      <Tabs.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="md-home" size={size} color={color} />
        )
      }} />
      <Tabs.Screen name="Form" component={FormScreen} options={{
        title: 'New Post',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle" size={size} color={color} />
        )
      }} />
      {
        !isAuth ? (
          <Tabs.Screen name="Auth" component={AuthNavigation} options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="enter-outline" size={size} color={color} />
            )
          }} />
        ) : (
          <Tabs.Screen name="Profile" component={ProfileScreen} options={{
            tabBarIcon: ({ color, size }) => (
              <Avatar text={user?.name || ''} />
            )
          }} />
        )
      }
    </Tabs.Navigator>
  )
}

const AuthNavigation = () => {
  const { visibleToggle } = useContext(AboutContext);

  return (
    <Stack.Navigator screenOptions={{
      headerRight: () => (
        <FlatButton title='About' onPress={visibleToggle} />
      ),
    }}>
      <Stack.Screen name='Signin' component={SigninScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  )
}

const Navigations = () => {
  const { authenticate } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  useEffect(() => {
    const getSavedStorage = async () => {
      const savedStorage = await AsyncStorage.getItem('user');
      if (!savedStorage) {
        return;
      }
      const storage = JSON.parse(savedStorage);
      const isLessThen24Hours = is24Hours(storage.created_at);
      if (!isLessThen24Hours) {
        authenticate(storage.token, storage.id, storage.name, storage.email);
      } else {
        await AsyncStorage.removeItem('user');
        setAlert({ color: 'yellow', message: 'session has expired' });
      }
    }
    getSavedStorage();
  }, [])
  return (
    <NavigationContainer>
      <RootStackNavigation />
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AuthContextProvider>
        <AlertContextProvider>
          <AboutContextProvider>
            <Navigations />
          </AboutContextProvider>
        </AlertContextProvider>
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  aboutBtn: {
    marginRight: 16,
  }
});