import { PlaceType } from "./mapTypes";
import MapMarker from "./MapMarker";
import { useMap } from "../hooks/useMap";
import { useEffect } from "react";

interface MapMarkerControlProps {
  places: PlaceType[];
  selectedPlaceId?: string;
}

const MapMarkerController = (props: MapMarkerControlProps) => {
  const map = useMap();

  //최초에 장소 이동
  useEffect(() => {
    if (props.places.length < 1) {
      return;
    }
    const bounds = new window.kakao.maps.LatLngBounds();

    props.places.forEach((place) => {
      bounds.extend(place.position);
    });
    // bounds.extend(placePosition);

    map.setBounds(bounds);
  }, [props.places]);

  //불러온 리스트 장소 -- 각 위치에 마커가 세워진다
  return (
    <>
      {props.places.map((place, idx) => (
        <MapMarker
          key={place.id}
          place={place}
          showInfo={props.selectedPlaceId === place.id}
          index={idx}
        />
      ))}
    </>
  );
};

export default MapMarkerController;
