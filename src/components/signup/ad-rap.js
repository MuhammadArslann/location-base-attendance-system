import React, { useState } from 'react';
import './ad-rap.css';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import InputMask from 'react-input-mask';
function AdRap(props) {

   const [locations, setLocations] = useState([   
   ]);

   const { register, handleSubmit } = useForm();
   const onSubmit = async (data) => {

      let fm = new FormData();

      let locations =  [...document.querySelectorAll('.location-add-rap:checked')].map((location)=>{
            return location.value
      });
      
      fm.append('locations', JSON.stringify(locations));

      if (data.pics.length <= 5) {
         for (let item in data) {
            if (item == 'pics') {
               for (let mfile in data.pics) {
                  fm.append(item, data.pics[mfile]);
               }
            }
            else {
               fm.append(item, data[item]);
            }
         }
         let resp = await axios.post('/ad-rap', fm);
         props.history.push('/');
      } else {
         alert('You can upload only 5 files....!')
      }
   };
   return <>
       <div className='full'>
         <div className='container'>
            <div>
               <center>
                  <h4>Signup</h4>
               </center>
            </div>
            <div class="div">
               <div class="row">
                  <form onSubmit={handleSubmit(onSubmit)} class="col s12">
                     <div class="row">
                        <div class="input-field col s6">
                           <input id="name" type="text" {...register('name')} />
                           <label for="name">Name</label>
                        </div>

                        <div class="input-field col s6">
                           <input className='validate' name='email' id="email" type="email"  {...register('email')} />
                           <label for="email">Email</label>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col s6">
                           <div class="row">
                              <div class="input-field col s12">
                                 <InputMask id="cnic" class="materialize-textarea" type='text' mask="99999-9999999-9" required  {...register('CNIC')} />                                 <label for="cnic">CNIC</label>
                              </div>
                           </div>
                        </div>

                        <div class="col s6">
                           <div class="row">
                              <div className="input-field col s12">
                                 <input id="password" type="password" className="validate" minlength="6" required  {...register('password')} />
                                 <label for="password">Password</label>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col s6">
                           <div class="file-field input-field">
                              <div class="file-path-wrapper">
                                 <input class="file-path validate" type="text" placeholder="Upload Picture" />
                                 <div class="btn">
                                    <span>Browse</span>
                                    <input type="file" multiple required {...register('pics')} />
                                 </div>
                              </div>

                           </div>
                        </div>
                        <div class="col s6">
                           {
                              locations.map((location) => {
                                 return <p className="i-block">
                                    <label>
                                       <input className="location-add-rap" value={location._id} type="checkbox" />
                                       <span>{location.address}</span>
                                    </label>
                                 </p>
                              })
                           }
                        </div>
                     </div>
                     <center>
                        <button class="btn waves-effect waves-light" type="submit" >Post
                        <i class="material-icons right">send</i>
                        </button>
                     </center>
                  </form>
               </div>
            </div>
         </div>
      </div> 
   </>
}
export default connect((myStore) => {
   return myStore;
})(AdRap);