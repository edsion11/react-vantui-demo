import logo from "./logo.svg";
import "./App.less";
import { Button, Image,Toast } from "@antmjs/vantui";
// import { View } from "@tarojs/components";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button type="default" className="my-btn">默认按钮</Button>
        {/* <Button type="primary">主要按钮</Button>
        <Button type="info">信息按钮</Button>
        <Button type="warning">警告按钮</Button>
        <Button type="danger">危险按钮</Button> */}
        <Toast id="vanToast-demo1" />
      </header>
    </div>
  );
}

export default App;
