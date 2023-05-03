import { useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from './utils/Colors';
import HomeScreen from './screens/Home';
import FormScreen from './screens/Form';
import SigninScreen from './screens/Signin';
import SignupScreen from './screens/Signup';
import DetailScreen from './screens/Detail';
import ProfileScreen from './screens/Profile';
import AuthContextProvider, { AuthContext } from './store/context/authContext';
import AlertContextProvider from './store/context/alertContext';
import is24Hours from './utils/is24Hours';
import Avatar from './components/Avatar';

type RootStackParamList = {
  Home: undefined,
  Detail: { id: string },
  Signin: undefined,
  Signup: undefined,
}

type RootTabStackParamList = {
  Explore: undefined,
  Form: undefined,
  Auth: undefined,
  Profile: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<RootTabStackParamList>();

const RootStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={RootTabNavigation} options={{
        headerShown: false
      }} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  )
}

const RootTabNavigation = () => {
  const { user, isAuth } = useContext(AuthContext);

  return (
    <Tabs.Navigator screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: Colors.sky400,
      tabBarInactiveTintColor: Colors.gray300,
    }}>
      <Tabs.Screen name="Explore" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="md-home" size={size} color={color} />
        )
      }} />
      <Tabs.Screen name="Form" component={FormScreen} options={{
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
  return (
    <Stack.Navigator>
      <Stack.Screen name='Signin' component={SigninScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  )
}

const Navigations = () => {
  const { authenticate } = useContext(AuthContext);
  useEffect(() => {
    const getSavedStorage = async () => {
      const savedStorage = await AsyncStorage.getItem('user');
      if (savedStorage) {
        const storage = JSON.parse(savedStorage);
        const isLessThen24Hours = is24Hours(storage.created_at);
        if (!isLessThen24Hours) {
          authenticate(storage.token, storage.id, storage.name, storage.email);
        }
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
      <StatusBar style="auto" />
      <AuthContextProvider>
        <AlertContextProvider>
          <Navigations />
        </AlertContextProvider>
      </AuthContextProvider>
    </>
  );
}