import React, { useEffect, useState } from "react";
import Scichart from "./components/scichart";
import { data as mockData } from './data/sampleData';

const App = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const [sampleData, setSampleData] = useState({});

  useEffect(() => {
    setInterval(() => {
      console.log('useEffect =>', sampleData, Math.random());
      if (Math.random() < 0.5) {
        console.log('Setting data');
        setSampleData(mockData);
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
        orientation="vertical"
        data={sampleData}
      />
    </div>
  );
};

export default App;
