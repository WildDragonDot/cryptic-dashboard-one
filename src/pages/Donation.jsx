import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { contextMenuItems, donerGrid } from '../data/dummy';
import { Header } from '../components';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const Donation = () => {
  const navigate = useNavigate();
  const {account, status,setAccountAddress } = useStateContext();
  const [fetchAllData, setFetchAllData] = useState([]);
  const editing = { allowDeleting: true, allowEditing: true };

  async function fetchData() {
    try {
      const result = await axios.get(`${process.env.REACT_APP_LOCALHOST_URL}/php/API/fetch_doner`);
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
      <Header category="Page" title="Donation" />
      <GridComponent
        id="gridcomp"
        dataSource={fetchAllData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {donerGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
      </GridComponent>
    </div>
  );
};
export default Donation;
