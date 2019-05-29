import React, { Component, Fragment } from 'react';

import { View, Dimensions, Image } from 'react-native';
import MapView, {Marker}from "react-native-maps";
import Search from "../Search";
import Directions from "../Directions";
import {getPixelSize} from '../../utils';
import Geocoder from "react-native-geocoding";

import markerImage from '../../assets/marker.png';
import backImage from "../../assets/back.png";
import { Back, LocationBox, LocationText, LocationTimeBox, LocationTimeText, LocationTimeTextSmall } from "./styles";

import Details from "../Details";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

Geocoder.init('AIzaSyCPRgm5S6psz0qQTH9lWoqrF5xYtVgWQ5k');

export default class Map extends Component {
  state ={
    region: null,
    destination: null,
    duration: null,
    location: null
  }

  componentDidMount() {
      navigator.geolocation.getCurrentPosition(
       async ({coords: {latitude, longitude}})=>{
        const response = await Geocoder.from({latitude, longitude});
        const address = response.results[0].formatted_address;
        const location = address.substring(0, address.indexOf(','));
     
        this.setState({
              region: {latitude, longitude, latitudeDelta:LATITUDE_DELTA,longitudeDelta: LONGITUDE_DELTA},
              location
          })
        }, //succes,
        ()=>{}, //error,
        {
          timeout: 2000,
          enableHighAccuracy: true,
          maximumAge: 1000
        }
      );
  }
  handleLocationSelected = (data, {geometry})=>{
    const {location: {lat: latitude, lng:longitude}} = geometry;
  
    this.setState({
      destination:{
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      }
    })
  }

  handleBack = () =>{
    this.setState({destination:null});
  }
  render() {
    const rota = (this.state.destination) ? 
          <Fragment>
            <Directions 
              destination={this.state.destination}
              origin={this.state.region}
              onReady={result=>{
                this.setState({duration: Math.floor(result.duration)});
                this.mapView.fitToCoordinates(result.coordinates,{
                  edgePadding:{
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(350)
                  }
                });
              }}
            />
            <Marker coordinate={this.state.region} anchor={{x:0, y:0 }} >
                <LocationBox>
                   <LocationTimeBox>
                     <LocationTimeText>{this.state.duration}</LocationTimeText>
                     <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                   </LocationTimeBox>
                   <LocationText>{this.state.location}</LocationText>
                </LocationBox>
            </Marker>
            <Marker coordinate={this.state.destination} anchor={{x:0, y:0 }} image={markerImage} >
                <LocationBox>
                  <LocationText>{this.state.destination.title}</LocationText>
                </LocationBox>
            </Marker>
          </Fragment>
         :null;
    return (
        <View style={{flex:1}}>
            <MapView
                style={{flex:1}}
                region={this.state.region}
                showsUserLocation
                loadingEnabled
                ref={el => this.mapView = el}
            >             
            {rota}
            </MapView>
            {this.state.destination 
            ? <Fragment>
              <Back onPress={this.handleBack} >
                <Image source={backImage}/>
              </Back>
              <Details/>
              </Fragment>
            : <Search onLocationSelected={this.handleLocationSelected} />}
        </View>
    );
  }
}
