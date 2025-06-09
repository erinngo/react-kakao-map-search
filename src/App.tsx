import { useState } from "react";
import DynamicMap from "./Map/DynamicMap";
import KakaoMapScriptLoader from "./Map/KakaoMapScriptLoader";
import SearchLocation from "./Map/SearchLocation";
import { PlaceType } from "./Map/mapTypes";
import MapMarkerController from "./Map/MapMarkerController";

const App = () => {
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  // console.log([places]);
  console.log("✅ App 렌더링됨");

  return (
    <>
      <KakaoMapScriptLoader>
        {/* DynamicMap에  context가 존재  => 하위 컴포넌트는 모두 적용받을 수 있다*/}
        <DynamicMap>
          <MapMarkerController
            places={places}
            selectedPlaceId={selectedPlaceId}
          />
          <SearchLocation
            onUpdatePlaces={(places) => {
              setPlaces(places);
            }}
            onSelect={(placeId) => {
              setSelectedPlaceId(placeId);
            }}
          />
        </DynamicMap>
      </KakaoMapScriptLoader>
    </>
  );
};
export default App;
