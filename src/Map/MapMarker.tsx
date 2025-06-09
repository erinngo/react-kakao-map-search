import { useMemo } from "react";
import { PlaceType } from "./mapTypes";
import { useMap } from "../hooks/useMap";
import { useLayoutEffect, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
interface MapMarkerProps {
  place: PlaceType;
  showInfo?: boolean;
  index: number;
}

/**
 * 지도에 마커 띄우기만 처리, Return 없음(화면에 렌더링하는 기능은 없는 컴포넌트)
 */

// 마커 이미지 url, 스프라이트 이미지를 씁니다
const MARKER_IMAGE_URL =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
const MapMarker = (props: MapMarkerProps) => {
  const map = useMap();
  const container = useRef(document.createElement("div"));

  //지도 해당 마커에 마우스 올렸을때 - 팝업
  const infoWindow = useMemo(() => {
    // container.current.style.position = "absolute";
    // container.current.style.bottom = "40px";
    return new kakao.maps.CustomOverlay({
      position: props.place.position,
      content: container.current,
      map: map,
    });
  }, []);

  /**
   * NOTE: 컴포넌트 최초 마운트될때, 한번만 생성
   * useMemo()
   * 딱 한번 만든 후, 변수로 저장해서 재사용
   */
  const marker = useMemo(() => {
    container.current.style.position = "absolute";
    container.current.style.bottom = "40px";

    const imageSize = new kakao.maps.Size(36, 37); // 마커 이미지의 크기
    const imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, props.index * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    };
    const markerImage = new kakao.maps.MarkerImage(
      MARKER_IMAGE_URL,
      imageSize,
      imgOptions
    );

    const marker = new kakao.maps.Marker({
      map: map,
      position: props.place.position,
      image: markerImage,
    });

    //마커 클릭시 동작
    kakao.maps.event.addListener(marker, "click", function () {
      map.setCenter(props.place.position);
      map.setLevel(4, {
        animate: true,
      });
      infoWindow.setMap(map);
    });

    return marker;
  }, []);

  /**
   * NOTE: DOM 그려지기 직전(마운트 직전)에 실행됨
   * 생명주기 (componentDidMount() -> componentWillUnmount())
   * useEffect(() => {
        // 이 안은 mount 시 실행

        return () => {
        // 이건 unmount 시 실행
        };
    }, []);

   */
  useLayoutEffect(() => {
    marker.setMap(map); //지도 위에 '마커 표시'

    //componentWillUnmount -> 언마운트 될때 '마커 삭제' -> 초기화
    return () => {
      marker.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (props.showInfo) {
      infoWindow.setMap(map);
      return;
    }

    //컴포넌트 언마운트 될때, 선택 해제
    return () => {
      infoWindow.setMap(null);
    };
  }, [props.showInfo]);

  return container.current
    ? createPortal(
        <Message
          onClick={() => {
            infoWindow.setMap(null);
          }}
        >
          <label>{props.place.title}</label>

          <Address>{props.place.address}</Address>
        </Message>,
        container.current
      )
    : null;
};
const Address = styled.span`
  font-size: 12px;
  color: #555;
`;
const Message = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 180px;
  min-height: 50px;
  margin-left: -90px;
  border-radius: 16px;

  white-space: normal;

  background-color: rgb(250 235 215 / 85%);
`;
export default MapMarker;
