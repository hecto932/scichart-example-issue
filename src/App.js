import React, { useEffect, useState } from "react";
import Scichart from "./components/scichart";
import { data } from './data/sampleData';

const App = () => {
  const [sampleData, setSampleData] = useState({});

  useEffect(() => {
    setInterval(() => {
      console.log('useEffect =>', sampleData, Math.random());
      if (Math.random() < 0.5) {
        console.log('Setting data');
        setSampleData(data);
      } else {
        console.log('Removing data');
        setSampleData({});
      }
    }, 3000);
  }, []);

  return (
    <div className="App">
      <h1>Testing</h1>
      <Scichart
        id="scichart-root-1"
        data={sampleData}
      />
      <br />
      <Scichart
        id="scichart-root-2"
        data={data}
      />
    </div>
  );
};

export default App;
