import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {useNavigation, useRoute} from '@react-navigation/native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Feather';
import {SvgUri} from 'react-native-svg';

import api from '../../services/api';

import styles from './styles';

interface Item {
  id: number;
  title: string;
  image_mobile_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_mobile_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  selectedState: string;
  selectedCity: string;
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get('/items').then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const permissionRequest =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const permissionResult = await request(permissionRequest);

      if (permissionResult !== 'granted') {
        Alert.alert(
          'Ops! Precisamos da sua permissão para obtermos a sua localização.',
        );
      }

      Geolocation.getCurrentPosition((info) => {
        setInitialPosition([info.coords.latitude, info.coords.longitude]);
      });
    }

    loadPosition();
  }, []);

  useEffect(() => {
    api
      .get('points', {
        params: {
          state: routeParams.selectedState,
          city: routeParams.selectedCity,
          items: selectedItems,
        },
      })
      .then((response) => {
        setPoints(response.data);
      });
  }, [selectedItems]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', {point_id: id});
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo!</Text>
        <Text style={styles.description}>
          Encontre um ponto de coleta no mapa abaixo.
        </Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}>
              {points.map((point) => (
                <Marker
                  key={point.id}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}>
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image_mobile_url,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              selectedItems.includes(item.id) ? styles.selectedItem : {},
            ]}
            onPress={() => handleSelectItem(item.id)}
            activeOpacity={0.6}>
            <SvgUri width={42} height={42} uri={item.image_mobile_url} />
            <Text style={styles.itemTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Points;
