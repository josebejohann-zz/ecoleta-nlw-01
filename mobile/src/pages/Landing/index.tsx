import React, {useEffect, useState} from 'react';
import {View, ImageBackground, Image, Text} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-community/picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';

import Logo from '../../assets/logo.png';
import Background from '../../assets/home-background.png';

import styles from './styles';

interface IBGEResponse {
  nome: string;
  sigla: string;
}

const Landing = () => {
  const {navigate} = useNavigation();

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedState, setSelectedState] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios
      .get<IBGEResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      )
      .then((response) => {
        const names = response.data.map((state) => state.sigla);

        setStates(names);
      });
  }, []);

  useEffect(() => {
    if (selectedState === '0') {
      return;
    }

    axios
      .get<IBGEResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`,
      )
      .then((response) => {
        const names = response.data.map((city) => city.nome);

        setCities(names);
      });
  }, [selectedState]);

  function handleNavigateToPoints() {
    navigate('Points', {
      selectedState,
      selectedCity,
    });
  }

  return (
    <ImageBackground
      source={Background}
      style={styles.container}
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

      <View style={styles.input}>
        <Picker
          selectedValue={selectedState}
          onValueChange={(value: any) => setSelectedState(value)}>
          <Picker.Item label="Selecione um Estado" value="0" />
          {states.map((state) => (
            <Picker.Item key={state} label={state} value={state} />
          ))}
        </Picker>
      </View>

      <View style={styles.input}>
        <Picker
          selectedValue={selectedCity}
          onValueChange={(value: any) => setSelectedCity(value)}>
          <Picker.Item label="Selecione uma cidade" value="0" />
          {cities.map((city) => (
            <Picker.Item key={city} label={city} value={city} />
          ))}
        </Picker>
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
