import { createContext, useContext } from "react";

export const KakaoMapContext = createContext<kakao.maps.Map | null>(null);

/**
 * 커스텀훅을 사용하여 context를 생성한다.
 * context 하위의 컴포넌트들은 언제나 useMap()을 호출하여 map 객체를 바로 새용 가능하다
 */
export const useMap = () => {
  const kakaoMap = useContext(KakaoMapContext);

  if (!kakaoMap) {
    throw new Error("kakaoMap not found");
  }

  return kakaoMap;
};
