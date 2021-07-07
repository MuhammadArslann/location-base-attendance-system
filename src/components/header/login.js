import React from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import M from 'materialize-css';
import './login.css';
import {connect} from 'react-redux';
import myStore from '../../store/store';

function Login(props) {
    
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = async (data) =>{ 
        let resp = await axios.post('/login',data);
        var loginModal = M.Modal.init(document.getElementById('modal1'), {});

        loginModal.close();
        console.log(resp.data);
        if(resp.data.msg=='User Found'){
            localStorage.setItem('token', resp.data.token);
            myStore.dispatch({
                type : "LOGIN_OK",
                payload:resp.data
            });
        }else if(resp.data.msg=='User Not Found'){
            alert('Please Type valid User Name OR Password...!');
        }
    };
    return <div id="modal1" class="modal">
        <div className="modal-content">
                <center>
                    <div className="container-login">
                        <div className="z-depth-1 grey lighten-4 row" style={{ display: 'inline-block', padding: '32px 48px 0px 48px', border: '1px solid #EEE' }}>

                            <form onSubmit={handleSubmit(onSubmit)} className="col s12" method="post">
                                <div className='row'>
                                    <div className='col s12'>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='input-field col s12'>
                                        <input className='validate' type='email' name='email' id='email'  {...register('email')} />
                                        <label for='email'>Enter your email</label>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='input-field col s12'>
                                        <input className='validate' type='password' name='password' id='password' {...register('password')} />
                                        <label for='password'>Enter your password</label>
                                    </div>
                                </div>
                                <br />
                                <center>
                                    <div className='row'>
                                        <button type='submit' name='btn_login' className='col s12 btn btn-large waves-effect indigo'>Login</button>
                                    </div>
                                </center>
                            </form>
                        </div>
                    </div>
                </center>
        </div>
    </div>
}
export default connect((myStore)=>{
    return myStore;
})(Login);
