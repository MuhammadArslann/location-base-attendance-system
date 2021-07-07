import {createStore,combineReducers} from 'redux';
let  initialData = {siteUser:{}};
function SiteUserReducer(oldData=initialData,newData){
    oldData={...oldData};
    if(newData.type=='LOGIN_OK'){
        oldData.siteUser =  newData.payload
    }
    if(newData.type=='LOGOUT'){
        oldData.siteUser = {};
    }
    // console.log(oldData);
    localStorage.setItem('reduces', JSON.stringify(oldData))

return oldData;
}
const AllReducers =combineReducers({SiteUserReducer})
const myStore=createStore(AllReducers, JSON.parse(localStorage.getItem('reduces')));
export default myStore;