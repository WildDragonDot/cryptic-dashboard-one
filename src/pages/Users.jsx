import React, { useEffect, useState } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page } from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { employeesGrid } from '../data/dummy';
import { Header } from '../components';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const Users = () => {
  const navigate = useNavigate();
  const { currentColor, accountAddress2,status,setAccountAddress,account } = useStateContext();
  const [fetchAllData, setFetchAllData] = useState([]);
  const toolbarOptions = ['Search'];

  const editing = { allowDeleting: true, allowEditing: true };

  async function fetchData() {
    try {
      const result = await axios.get(`${process.env.REACT_APP_LOCALHOST_URL}/php/API/fetch_users`);
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
      <Header category="Page" title="All Users" />
      <GridComponent
        dataSource={fetchAllData}
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {employeesGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Search, Page]} />

      </GridComponent>
    </div>
  );
};
export default Users;
