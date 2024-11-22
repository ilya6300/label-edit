import ".//style/App.css";
import { Editor } from "./components/Editor";
// import { d } from "../src/data.ini";
import { useLayoutEffect } from "react";
import Theme from "./store/Theme";
import { observer } from "mobx-react-lite";

const App = observer(() => {
  useLayoutEffect(() => {
    Theme.getBlackTheme();
    // console.log("d", d);
  }, []);

  return (
    <div style={{ background: Theme.background }} className="App">
      <Editor />
    </div>
  );
});

export default App;
