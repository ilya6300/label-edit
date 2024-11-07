import ".//style/App.css";
import { Editor } from "./components/Editor";
// import { d } from "../src/data.ini";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // console.log("d", d);
  }, []);

  return (
    <div className="App">
      <Editor />
    </div>
  );
}

export default App;
