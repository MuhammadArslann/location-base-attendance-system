import './App.css';
import React, { useEffect} from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import AdRap from './components/add-rap/ad-rap';
import SimpleMap from './components/add-location/add-location';
import { Provider } from 'react-redux';
import myStore from './store/store';
import axios from 'axios';
import MenuComponent from './components/menu-component/menu-comonent';

import Visits from './components/visits/visits';
import ShowRaps from './components/show-raps/show-raps';

import EditRap from './components/edit-rap/edit-rap';

import Home from './components/home/home';

function App() {
  useEffect(async () => {
    let token= localStorage.getItem('token');
    if (token!=null) {
      try {
        let resp = await axios.post('/checksession', { token });
        // console.log(resp.data);
        myStore.dispatch({
          type:"LOGIN_OK",
          payload:resp.data
        })
      } catch (e) {
        console.log(e);
      }
    }
  }, [])
  return (
    <BrowserRouter>

   <Provider store={myStore}>
      <Navbar />

       <Route path="/add-rap" component={AdRap} />    
      <Route path="/add-location" component={SimpleMap} />
      <Route path="/show-raps" component={ShowRaps} />    
      <Route path="/edit/:id" component={EditRap} />    
      <Route path="/visits/:id" component={Visits} />    

      <Route exact path="/" component={Home} />
      </Provider>

    </BrowserRouter>
  );
}

export default App;