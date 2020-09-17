import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Landing from './pages/Landing';
import Points from './pages/Points';
import Detail from './pages/Detail';

const {Navigator, Screen} = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: '#F0F0F5',
          },
        }}>
        <Screen name="Landing" component={Landing} />
        <Screen name="Points" component={Points} />
        <Screen name="Detail" component={Detail} />
      </Navigator>
    </NavigationContainer>
  );
};

export default Routes;
