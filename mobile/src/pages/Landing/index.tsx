import React from 'react';
import {View, ImageBackground, Image, Text} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import Logo from '../../assets/logo.png';
import Background from '../../assets/home-background.png';

import styles from './styles';

const Landing = () => {
  const {navigate} = useNavigation();

  function handleNavigateToPoints() {
    navigate('Points');
  }

  return (
    <ImageBackground
      source={Background}
      style={styles.container}
      // eslint-disable-next-line react-native/no-inline-styles
      imageStyle={{
        width: 274,
        height: 368,
      }}>
      <View style={styles.main}>
        <Image source={Logo} />

        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Landing;
