import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  LineSeries,
  DateTime,
  Legend,
  Tooltip,
  Category,
  DataLabel
} from "@syncfusion/ej2-react-charts";

import { useStateContext } from "../../contexts/ContextProvider";

const LineChart = ({data, id, xTitle, yTitle, xName, yName}) => {
  const { currentMode } = useStateContext();

  return (
    <ChartComponent
      id={id}
      height="420px"
      width="auto"
      primaryXAxis={{ valueType: "Category", title: xTitle }}
      primaryYAxis={{ title: yTitle}} 
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === "Dark" ? "#33373E" : "#fff"}
      legendSettings={{ background: "white" }}
      resized={(args) => {
        args.chart.refresh();
      }}
    >
      <Inject services={[LineSeries, DateTime, Legend, Tooltip, Category, DataLabel]} />
      <SeriesCollectionDirective>
        <SeriesDirective 
          type="Line"
          dataSource={data}
          xName={xName}
          yName={yName}
          marker={{dataLabel : {visible : true}, visible: true, width: 10, height: 10}}
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default LineChart;
