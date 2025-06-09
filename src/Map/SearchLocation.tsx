import styled from "@emotion/styled";
import { useState, useEffect, useRef } from "react";
import { useMap } from "../hooks/useMap";
import { PlaceType } from "./mapTypes";

/**
 * NOTE:
 * 위치를 핀 표시하기 위해, (전체목록,입력값)을 상위 컴포넌트에서 받아오기
 */
interface SearchLocationProps {
  onUpdatePlaces: (places: PlaceType[]) => void;
  onSelect: (placeId: string) => void;
}
const SearchLocation = (props: SearchLocationProps) => {
  const map = useMap();
  /**
   * NOTE:
   * 문자열/숫자 등 단순한 값은 생략 가능
   * 배열/객체는 웬만하면 타입 명시하기:
   *
   * keyword: 사용자가 입력한 검색어
   * places: 장소 검색 결과 배열 -> 리스트로 화면에 출력
   */
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const placeService = useRef<kakao.maps.services.Places | null>(null);

  useEffect(() => {
    if (placeService.current) {
      return;
    }

    //NOTE:장소 객체 생성
    placeService.current = new kakao.maps.services.Places();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    // console.log(keyword);
  };
  const searchPlaces = (keyword: string) => {
    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return false;
    }

    if (!placeService.current) {
      alert("placeService 에러"); //TODO: 에러 핸들링
      return;
    }

    /**
     * NOTE: 키워드로 장소검색을 요청한다
     * 카카오에서 제공하는 API 를 사용하기 -> 문서를 보고 활용할 줄 알아야
     *
     */
    placeService.current.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        console.log(data);
        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        const placeInfos = data.map((placeSearchResultItem, idx) => {
          return {
            id: placeSearchResultItem.id,
            position: new kakao.maps.LatLng(
              Number(placeSearchResultItem.y),
              Number(placeSearchResultItem.x)
            ),
            title: placeSearchResultItem.place_name,
            address: placeSearchResultItem.address_name,
          };
        });
        //TODO: 특정 위치로 이동할 준비
        props.onUpdatePlaces(placeInfos);
        setPlaces(placeInfos);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
        return;
      }
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchPlaces(keyword);
  };

  /**
   *  NOTE: place는 넘겨받는 하나의 장소 정보
   * 해당 위치로 맵을 움직인다
   */
  const handlePlaceClick = (place: PlaceType) => {
    map.setCenter(place.position);
    map.setLevel(4);
    props.onSelect(place.id);
  };
  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Input
            placeholder="검색하세요"
            value={keyword}
            onChange={handleSearch}
          ></Input>
          <List>
            {places.map((each, idx) => (
              <Item key={idx} onClick={() => handlePlaceClick(each)}>
                <label>{`${idx + 1}. ${each.title}`}</label>
                <label>{each.address}</label>
              </Item>
            ))}
          </List>
        </Form>
      </Container>
    </>
  );
};

const Container = styled.div`
  position: absolute;
  z-index: 1;
  height: 100%;
  background: white;
  opacity: 0.8;
  overflow-y: auto;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  position: sticky;
`;
const Input = styled.input`
  width: 100%;
  min-width: 200px;
  padding: 8px;
  border: 1px solid #c0c0c0;
`;
const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
`;
const Item = styled.li`
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-bottom: 1px dashed #d2d2d2;
  cursor: pointer;
  

  &:hover {
    background-color: #d2d2d2;
    opacity: 1;
    transition:background-color: 0s
  }
`;
export default SearchLocation;
