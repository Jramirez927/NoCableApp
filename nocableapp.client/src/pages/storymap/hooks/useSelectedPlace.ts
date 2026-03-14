import { useEffect, useRef, useState } from 'react';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { toLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import Map from 'ol/Map';
import { MapUtils } from '../../../utils/MapUtils';
import { reverseGeocode } from '../../../api/Photon';

const pinStyle = MapUtils.createPinIconStyle();

export function useSelectedPlace(map: Map | null) {
  const [selectedPlace, setSelectedPlace] = useState<Coordinate | null>(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState('');

  const selectedPlaceSource = useRef(new VectorSource());
  const selectedPlaceLayer = useRef(
    new VectorLayer({ source: selectedPlaceSource.current, style: pinStyle })
  );

  useEffect(() => {
    if (!selectedPlace) {
      setSelectedPlaceName('');
      selectedPlaceSource.current.clear();
      return;
    }

    MapUtils.navigateToCoords(map!, selectedPlace, { zoom: 19 }, () => {
      selectedPlaceSource.current.clear();
      selectedPlaceSource.current.addFeature(new Feature(new Point(selectedPlace)));
    });

    const [lon, lat] = toLonLat(selectedPlace);
    reverseGeocode(lon, lat).then(({ data }) => {
      if (data) setSelectedPlaceName(data.display_name);
    });
  }, [selectedPlace]);

  return {
    selectedPlace,
    setSelectedPlace,
    selectedPlaceName,
    setSelectedPlaceName,
    selectedPlaceLayer: selectedPlaceLayer.current,
  };
}
