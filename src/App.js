import React, { useEffect, useState } from "react";
import Scichart from "./components/scichart";
import { data } from './data/sampleData';

import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { ECoordinateMode } from 'scichart/Charting/Visuals/Annotations/AnnotationBase';


const App = () => {
  const [sampleData, setSampleData] = useState({});

  useEffect(() => {
    console.log('Setting data');
    setSampleData(data);
    // setInterval(() => {
    //   console.log('useEffect =>', sampleData, Math.random());
    //   if (Math.random() < 0.5) {
    //     console.log('Setting data');
    //     setSampleData(data);
    //   } else {
    //     console.log('Removing data');
    //     setSampleData({});
    //   }
    // }, 3000);
  }, []);

  return (
    <div className="App">
      {/* <h1>Testing</h1>
      <Scichart
        id="scichart-root-1"
        data={sampleData}
      />
      <br /> */}
      <Scichart
        id="scichart-root-2"
        data={data}
        orientation="vertical"
        annotations={[
          new BoxAnnotation({
            fill: "#FF191955",
            stroke: "#FF1919",
            strokeThickness: 1,
            xCoordinateMode: ECoordinateMode.DataValue,
            x1: 1612288800000,
            x2: 1612386000000,
            yCoordinateMode: ECoordinateMode.Relative,
            y1: 1.0,
            y2: 0.0,
          }),
        ]}
      />
    </div>
  );
};

export default App;
