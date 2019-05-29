import React from 'react';

import MapViewDirections from 'react-native-maps-directions';

// import { Container } from './styles';

const Directions = ({destination, origin, onReady}) => (
    <MapViewDirections
        destination={{latitude: destination.latitude, longitude:destination.longitude}}
        origin={{latitude: origin.latitude, longitude:origin.longitude}}
        onReady={onReady}
        apikey='AIzaSyCPRgm5S6psz0qQTH9lWoqrF5xYtVgWQ5k'
        strokeWidth={3}
        strokeColor='#222'
    />
);

export default Directions;
