import React, { useState, useEffect } from 'react';
import './edit-rap.css';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';
function AdRap(props) {

   let [editedUser, setEditedUser] = useState({ locations: [], pics: [] });
   const [locations, setLocations] = useState([]);

   let params = useParams();



   useEffect(() => {


      axios.post('/load-rap/' + params.id).then((resp) => {

         if (resp.data.success) {
            setEditedUser(resp.data.user);
            setTimeout(() => {

               document.querySelectorAll('#editBox label').forEach((label) => {

                  label.classList.add('active')


                });

            }, 10);
         }

         if (!locations.length) {
            axios.post('/get-locations').then((resp) => {
               setLocations(resp.data.locations)
            });
         }

         if (locations.length) {
            document.querySelectorAll('.location-add-rap').forEach((tag) => {

               tag.checked = (editedUser.locations.indexOf(tag.value) != -1);
            });
         }

      });


   }, [locations]);

   const { register, handleSubmit } = useForm();

   const onSubmit = async (data) => {

      let fm = new FormData();

      for (let item in data) {
         if (data[item] == "") {
            delete data[item];
         }
      }

      let cData = { ...editedUser, ...data };;


      cData.locations = [...document.querySelectorAll('.location-add-rap:checked')].map((location) => {
         return location.value
      });


      // data._id = editedUser._id;

      // fm.append('locations', JSON.stringify(locations));

      if (cData.pics.length <= 5) {
         for (let item in cData) {
            if (item == 'pics') {
               for (let mfile of cData.pics) {
                  fm.append(item, mfile);
               }
            }
            else {
               fm.append(item, cData[item]);
            }
         }
         let resp = await axios.post('/update-rap', fm);
         props.history.push('/');
      } else {
         alert('You can upload only 5 files....!')
      }
   };
   return <>
      { localStorage.getItem('token') ? <div className='full'>
         <div className='container' id="editBox">
            <div>
               <center>
                  <h4>Edit-Employee</h4>
               </center>
            </div>
            <div class="div">
               <div class="row">
                  <form onSubmit={handleSubmit(onSubmit)} class="col s12">
                     <div class="row">
                        <div class="input-field col s6">
                           <input defaultValue={editedUser.name} id="name" type="text" {...register('name')} />
                           <label for="name">Name</label>
                        </div>

                        <div class="input-field col s6">
                           <input defaultValue={editedUser.email} className='validate' name='email' id="email" type="email"  {...register('email')} />
                           <label for="email">Email</label>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col s6">
                           <div class="row">
                              <div class="input-field col s12">
                                 <InputMask defaultValue={editedUser.cnic} id="cnic" name="cnic" class="materialize-textarea" type='text' required  {...register('cnic')} />                                 <label for="cnic">CNIC</label>
                              </div>
                           </div>
                        </div>

                        <div class="col s6">
                           <div class="row">
                              <div className="input-field col s12">
                                 <input defaultValue={editedUser.password} id="password" type="password" className="validate" minlength="6" required  {...register('password')} />
                                 <label for="password">Password</label>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col s6">
                           <div class="file-field input-field">
                              <div class="file-path-wrapper">
                                 <input defaultValue={editedUser.pics.join(', ')} class="file-path validate" type="text" placeholder="Upload Picture" />
                                 <div class="btn">
                                    <span>Browse</span>
                                    <input type="file" multiple {...register('pics')} />
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
      </div> : <Redirect to='/' />}
   </>
}
export default connect((myStore) => {
   return myStore;
})(AdRap);