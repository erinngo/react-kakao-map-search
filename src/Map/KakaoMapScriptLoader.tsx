import { useEffect, useState } from "react";
import { ReactNode } from "react";

const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";
const KAKAO_MAP_APP_KEY = process.env.KAKAO_MAP_KEY;

interface KakaoMapScriptLoaderProps {
  children: ReactNode;
}
const KakaoMapScriptLoader = (props: KakaoMapScriptLoaderProps) => {
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);
  useEffect(() => {
    if (document.getElementById("kakao-map-script")) {
      console.log("이미 kakao-map-script가 존재함");
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_MAP_SCRIPT_ID;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&libraries=services&autoload=false`;

    console.log("스크립트 주소:", script.src);

    script.onload = () => {
      //NOTE: 파라미터 'autoload=false' 와 연결되는 부분, 자동로드처리되면 안되고 카카오맵스가 로드된 후에 상태변경해야한다
      window.kakao.maps.load(() => {
        // 성공처리
        setMapScriptLoaded(true);
        console.log("성공");
      });
    };
    script.onerror = () => {
      // 실패
      setMapScriptLoaded(false);
      console.log("실패");
    };

    document.head.appendChild(script);
  }, []);
  return (
    <>
      {mapScriptLoaded ? props.children : <div>지도를 가져오는 중입니다.</div>}
    </>
  );
};

export default KakaoMapScriptLoader;
