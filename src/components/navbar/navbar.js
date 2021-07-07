import React, { useEffect } from 'react';
import './navbar.css';
import M from 'materialize-css';
import Login from '../header/login';
import { connect } from 'react-redux';
import myStore from '../../store/store';
import { useHistory, Link } from 'react-router-dom';

function NavBar(props) {

  let history = useHistory();

  useEffect(()=>{

    M.Sidenav.init(document.getElementById('mobile-demo'))

  }, [])
  
  return <div>
    <Login />
    <nav class="nav-extended  pushpin z-depth-3">

      <div className="logo">
        <Link to="/">
          <img src='/images/marker.png' />
          <span>Location Base Attendance System</span>
        </Link>
      </div>

      <div className="nav-wrapper">
        <a onClick={() => {
          var drawer = M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
        }} data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>

        <ul className="right hide-on-med-and-down">
          <li style={props.SiteUserReducer.siteUser._id ? { display: 'block' } : { display: 'none' }}><a className="waves-effect waves-light btn-small btn modal-trigger" onClick={() => {
            myStore.dispatch({
              type: 'LOGOUT'
            })

            history.push('/');

            localStorage.removeItem('token');
          }}>Logout</a></li>

          <li style={!props.SiteUserReducer.siteUser._id ? { display: 'block' } : { display: 'none' }}><a onClick={() => {
            var loginModal = M.Modal.init(document.getElementById('modal1'), {});
            loginModal.open();
          }}>Login</a></li>
         


        </ul>
      </div>
    </nav>
    <ul className="sidenav" id="mobile-demo">
      <li style={props.SiteUserReducer.siteUser._id ? { display: 'block' } : { display: 'none' }}><a className='ad-rap' onClick={() => {
        myStore.dispatch({
          type: 'LOGOUT'
        })
        localStorage.removeItem('token');
      }}>Logout</a></li>

      <li style={!props.SiteUserReducer.siteUser._id ? { display: 'block' } : { display: 'none' }}><a onClick={() => {
        var loginModal = M.Modal.init(document.getElementById('modal1'), {});
        loginModal.open();
      }}>Login</a></li>

      <li style={!props.SiteUserReducer.siteUser._id ? { display: 'block' } : { display: 'none' }}><a onClick={() => {

        history.push('/signup');

      }}>Signup</a></li>
    </ul>
  </div>
}
export default connect((myStore) => {
  return myStore;
})(NavBar);