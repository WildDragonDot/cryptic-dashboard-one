import React from 'react';
import ReactDOM from 'react-dom';
import { MetaMaskProvider } from "metamask-react";
import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';

ReactDOM.render(
  <React.StrictMode>
    <MetaMaskProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </MetaMaskProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
