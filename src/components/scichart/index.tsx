/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/extensions */
/* eslint-disable no-bitwise */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState, useEffect } from "react";
import { format } from "date-fns";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import {
  ELegendOrientation,
  ELegendPlacement,
} from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { TSciChart } from "scichart/types/TSciChart";

import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { NumberRange } from "scichart/Core/NumberRange";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { EXyDirection } from "scichart/types/XyDirection";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { IAnnotation } from "scichart/Charting/Visuals/Annotations/IAnnotation";
import { CustomRolloverModifier } from "./CustomModifiers/CustomRolloverModifier";

export const randomColor = () => {
  const x = Math.round(0xffffff * Math.random()).toString(16);
  const y = 6 - x.length;
  const z = "000000";
  const z1 = z.substring(0, y);
  const color = `#${z1}${x}`;

  return color;
};

const formatAxis = (tickItem: number) => format(tickItem, "yyyy/MM/dd HH:mm a");
const numberToFix = (tickItem: number) => tickItem.toFixed(2);

const draw = async (
  divElem: string,
  orientation: string = "vertical",
  options: any
) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElem
  );

  const xAxis = new NumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext, {
    growBy: new NumberRange(0.01, 0.01),
  });

  xAxis.labelProvider.numericFormat = ENumericFormat.Date_DDMMYYYY;
  xAxis.labelProvider.formatLabel = formatAxis;

  yAxis.labelProvider.formatLabel = numberToFix;

  if (orientation === "vertical") {
    // SET VERTICAL ORIENTATION BY DEFAULT
    xAxis.axisAlignment = EAxisAlignment.Left;
    yAxis.axisAlignment = EAxisAlignment.Bottom;

    // An axis may be optionally flipped using flippedCoordinates property
    xAxis.flippedCoordinates = false;
    yAxis.flippedCoordinates = true;
  } else {
    xAxis.axisAlignment = EAxisAlignment.Bottom;
    yAxis.axisAlignment = EAxisAlignment.Left;

    // An axis may be optionally flipped using flippedCoordinates property
    xAxis.flippedCoordinates = false;
    yAxis.flippedCoordinates = false;
  }

  // ADDING AXES TO SURFACE
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  return { sciChartSurface, wasmContext };
};

interface Props {
  id: string;
  data?: any;
  annotations?: Array<IAnnotation>;
}

const Scichart: FC<Props> = ({ id, data = {}, annotations = [] }) => {
  const [chartReady, setChartReady] = useState(false);
  const [sciChartSurface, setSciChartSurface] = useState<SciChartSurface>();
  const [wasmContext, setWasmContext] = useState<TSciChart>();

  const [orientation, setOrientation] = useState("vertical");

  const [sciChartTooltip, setSciChartTooltip] = useState<any>();
  const [sciChartLegend, setSciChartLegend] = useState<any>();

  const [sciChartRubberModifier, setSciChartRubberModifier] = useState<any>();

  const [placementValue, setPlacementValue] = useState<ELegendPlacement>(
    ELegendPlacement.TopRight
  );
  const [orientationValue, setOrientationValue] = useState<ELegendOrientation>(
    ELegendOrientation.Vertical
  );

  const [showLegendValue, setShowLegendValue] = useState(true);
  const [showCheckboxesValue, setShowCheckboxesValue] = useState(true);
  const [showSeriesMarkersValue, setShowSeriesMarkersValue] = useState(true);

  const setChartOrientation = (
    scichart: SciChartSurface,
    orientation: string
  ) => {
    if (scichart) {
      const xAxis = scichart?.xAxes.get(0);
      const yAxis = scichart?.yAxes.get(0);

      if (xAxis && yAxis) {
        if (orientation === "vertical") {
          // SET VERTICAL ORIENTATION BY DEFAULT
          xAxis.axisAlignment = EAxisAlignment.Left;
          yAxis.axisAlignment = EAxisAlignment.Bottom;

          // An axis may be optionally flipped using flippedCoordinates property
          xAxis.flippedCoordinates = false;
          yAxis.flippedCoordinates = true;
        } else {
          xAxis.axisAlignment = EAxisAlignment.Bottom;
          yAxis.axisAlignment = EAxisAlignment.Left;

          // An axis may be optionally flipped using flippedCoordinates property
          xAxis.flippedCoordinates = false;
          yAxis.flippedCoordinates = false;
        }
      }
    }
  };

  const addLineDataSeries = (
    sciChartSurface: SciChartSurface,
    wasmContext: TSciChart
  ) => {
    const columns = Object.keys(data);

    console.log("addLineDataSeries =>", data);

    // This remove the previous data and allows create a new rendableSerie
    sciChartSurface.renderableSeries.clear();

    if (columns.length) {
      columns.forEach((columnName: string, index: number) => {
        const xyDataSeries = new XyDataSeries(wasmContext);
        xyDataSeries.dataSeriesName = columnName;
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
          drawNaNAs: ELineDrawMode.PolyLine,
          isDigitalLine: false,
          stroke: randomColor(),
          strokeThickness: 3,
          dataSeries: xyDataSeries,
        });
        data[columnName].forEach((item: any, index: number) => {
          xyDataSeries.append(item.dts, item[columnName]);
        });

        sciChartSurface.renderableSeries.add(lineSeries);
      });
    }
    sciChartSurface.zoomExtents();
  };

  const setLegendModifier = (resScichartSurface: SciChartSurface) => {
    const legendModifier = new LegendModifier({
      placement: placementValue,
      orientation: orientationValue,
      showLegend: showLegendValue,
      showCheckboxes: showCheckboxesValue,
      showSeriesMarkers: showSeriesMarkersValue,
    });
    resScichartSurface.chartModifiers.add(legendModifier);
    setSciChartLegend(legendModifier);
  };

  const setTooltip = (resScichartSurface: SciChartSurface) => {
    const tooltipModifier = new CustomRolloverModifier(
      {
        rolloverLineStrokeThickness: 5,
        isVerticalChart: orientation === "vertical",
      },
      id
    );

    resScichartSurface.chartModifiers.add(tooltipModifier);
    setSciChartTooltip(tooltipModifier);
  };

  const setZoomPanModifier = (resScichartSurface: SciChartSurface) => {
    const zoomPanModifier = new ZoomPanModifier();
    zoomPanModifier.onAttach = () =>
      console.log(`${id}: zoomPanModifier attached!`);
    zoomPanModifier.onDetach = () =>
      console.log(`${id}: zoomPanModifier detached!`);

    // Add Zoom Extents behavior
    resScichartSurface.chartModifiers.add(zoomPanModifier);
    setSciChartRubberModifier(zoomPanModifier);
  };

  const setMouseWheelZoomModifier = (resScichartSurface: SciChartSurface) => {
    const mouseWheelZoomModifier = new MouseWheelZoomModifier();
    mouseWheelZoomModifier.onDetach = () =>
      console.log(`${id}: mouseWheelZoomModifier removed!`);
    mouseWheelZoomModifier.onAttach = () =>
      console.log(`${id}: mouseWheelZoomModifier attached`);
    resScichartSurface.chartModifiers.add(mouseWheelZoomModifier);
  };

  const setZoomExtentsModifier = (resScichartSurface: SciChartSurface) => {
    const zoomExtentsModifier = new ZoomExtentsModifier();
    zoomExtentsModifier.onDetach = () =>
      console.log(`${id}: zoomExtentsModifier removed!`);
    zoomExtentsModifier.onAttach = () =>
      console.log(`${id}: zoomExtentsModifier attached`);
    resScichartSurface.chartModifiers.add(zoomExtentsModifier);
  };

  const setAnnotations = (resScichartSurface: SciChartSurface) => {
    console.log("setAnnotations => ", annotations);
    // resScichartSurface.annotations.clear();

    // ADD ANNOTATIONS
    annotations.forEach((item: IAnnotation) => {
      resScichartSurface.annotations.add(item);
    });
  };

  const onHandleScichartLegend = () => {
    if (sciChartLegend) {
      sciChartLegend.sciChartLegend.showLegend = !showLegendValue;
      setShowLegendValue(!showLegendValue);
    }
  };

  const onHandleRemoveAnnotations = () => {
    if (!sciChartSurface) {
      return;
    }

    sciChartSurface.annotations.clear();
  };

  const onHandleOrientation = () => {
    setOrientation(orientation === "vertical" ? "horizontal" : "vertical");
  };

  useEffect(() => {
    if (!sciChartSurface || !wasmContext) {
      return;
    }

    addLineDataSeries(sciChartSurface, wasmContext);
    // setAnnotations(sciChartSurface);
  }, [data]);

  // useEffect(() => {
  //   if (!sciChartSurface) {
  //     return;
  //   }

  //   setAnnotations(sciChartSurface);
  // }, [annotations]);

  useEffect(() => {
    if (sciChartSurface) {
      setChartOrientation(sciChartSurface, orientation);
    }
  }, [sciChartSurface, orientation]);

  useEffect(() => {
    (async () => {
      const res = await draw(id, orientation, {});
      setSciChartSurface(res.sciChartSurface);
      setWasmContext(res.wasmContext);
      addLineDataSeries(res.sciChartSurface, res.wasmContext);
      setLegendModifier(res.sciChartSurface);
      setZoomPanModifier(res.sciChartSurface);
      setMouseWheelZoomModifier(res.sciChartSurface);
      setZoomExtentsModifier(res.sciChartSurface);
      setTooltip(res.sciChartSurface);
      setAnnotations(res.sciChartSurface);
      setChartReady(true);
    })();

    return () => {
      sciChartSurface?.delete();
      setSciChartSurface(undefined);
    };
  }, []);

  return (
    <>
      <div
        id={id}
        style={{
          position: "relative",
          width: 1024,
          height: 768,
        }}
      />
      <button onClick={onHandleOrientation}>
        Change orientation to
        {orientation === " vertical" ? " horizontal" : " vertical"}
      </button>
      <button onClick={onHandleScichartLegend}>Show/hide Legend</button>
      <button onClick={onHandleRemoveAnnotations}>
        {annotations.length ? `Remove Annotations` : "Add annotations"}
      </button>
      <p>
        Annotations between {new Date(1612288800000).toLocaleTimeString()}
        {" and "}
        {new Date(1612386000000).toLocaleTimeString()}
      </p>
    </>
  );
};

export default Scichart;
