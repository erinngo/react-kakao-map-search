const path = require("path");

//웹팩 번들러를 Index.html에 추가하여 => 최종 Html 탄생
const HtmlWebpackPlugin = require("html-webpack-plugin");

//앱키 관리를 위한 환경변수
const dotenv = require("dotenv");
const webpack = require("webpack");

dotenv.config();
//process.env.KAKAO_MAP_KEY

//개발모드, 배포모드 구분하기위해
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",

  //import할 때 확장자 생략 가능하게 해주는 설정 -- ✅ JSX 인식 필수
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"], //
  },

  //어떤 파일을 바벨로 변환할지 지정 --> js, jsx
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(css)$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  /**
   * public/index.html을 템플릿으로 사용해서
   *dist/index.html을 자동 생성함
   *그 안에 <script src="my-first-webpack.bundle.js"> 가 자동 삽입돼
   */
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new webpack.DefinePlugin({
      //.env파일의 환경변수 사용
      "process.env": JSON.stringify(process.env),
    }),
  ],

  optimization: { minimizer: [] },

  //반환 관련 설정 - 폴더 설정 및 반환js 이름 설정
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].bundle.js",
    clean: true,
  },
  devtool: isProduction ? false : "eval-source-map",

  //npm install -D webpack-dev-server 관련 설정
  devServer: {
    port: 3000,
    //코드 수정 - 번들러에 자동 갱신
    hot: true,
    //서버실행 - 브라우저 자동 열림
    open: true,
    //에러시 브라우저창에 바로 확인
    client: {
      overlay: true,
      progress: true,
    },
  },
};
