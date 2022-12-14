import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChartComponent,
  ColumnSeries,
  LineSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  Tooltip,
  DataLabel,
} from "@syncfusion/ej2-react-charts";

import { useStateContext } from "../../contexts/ContextProvider";

const Stacked = ({type}) => {
  const { currentMode } = useStateContext();
  const [fetchAllData, setFetchAllData] = useState([]);
  const [ethData, setEthData] = useState({})
  const [maticData, setMaticData] = useState({})
  const eth_data = []
  const matic_data = []

  async function fetchData() {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_LOCALHOST_URL}/php/API/BarChart`
      );
      setFetchAllData(result.data.reverse());
      result.data.map((item) => {
        eth_data.push({ x: item.date, y: item.count_eth })
        matic_data.push({ x: item.date, y: item.count_matic })
      })
      setEthData(eth_data)
      setMaticData(matic_data)

    } catch (error) {
      setFetchAllData([]);
      console.error(error);
    }
  }
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    <ChartComponent
      id="charts"
      fill="blue" 
      height="420px"
      primaryXAxis={{ valueType: "Category", title: "Day", isIndexed: true }}
      primaryYAxis={{
        title: "Donation",
        labelFormat:"{value}" + ` ${type}`
      }}
      tooltip={{ enable: true }}
      chartArea={{ border: { width: 0 } }} 
      background={currentMode === "Dark" ? "#33373E" : "#fff"}
    >
      <Inject
        services={[ColumnSeries, LineSeries, Category, Tooltip, DataLabel]}
      ></Inject>
      <SeriesCollectionDirective>
        <SeriesDirective
          type="Column"
          dataSource={type === "ETH" ? ethData : maticData}
          xName="x"
          yName="y"
          marker={{ dataLabel: { visible: true }, visible: true }}
        />
      </SeriesCollectionDirective>
    </ChartComponent>
    </>
  );
};

export default Stacked;
