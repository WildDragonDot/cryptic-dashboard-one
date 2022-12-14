import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { ordersData, contextMenuItems, ordersGrid } from '../data/dummy';
import { Header } from '../components';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const Videos = () => {
  const navigate = useNavigate();
  const { currentColor,status,setAccountAddress,account} = useStateContext();
  const [fetchAllData, setFetchAllData] = useState([]);
  const editing = { allowDeleting: true, allowEditing: true };

  async function fetchData() {
    try {
      const result = await axios.get(`${process.env.REACT_APP_LOCALHOST_URL}/php/API/fetch_videos`);
      setFetchAllData(result.data);
    } catch (error) {
      setFetchAllData([]);
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const accountAddress = sessionStorage.getItem('finflixUser');
  useEffect(() => {
    if (status === 'notConnected') {
      setAccountAddress(null);
      navigate('/login');
    } else if (status === 'connected') {      
      if (!accountAddress) {
        setAccountAddress(null);
        navigate('/login');
      }else{
        setAccountAddress(account)
      }
    }
  }, [status,accountAddress]);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="All Videos" />
      <GridComponent
        id="gridcomp"
        dataSource={fetchAllData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {ordersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
      </GridComponent>
    </div>
  );
};
export default Videos;
