import MenuComponent from '../menu-component/menu-comonent';

import {connect} from 'react-redux';

function Home(props){

    return   <div className="App">
    {
       props.SiteUserReducer.siteUser.type == "admin" ? <MenuComponent /> : null}
 </div>


}

export default connect((store)=>{
    return store;
})(Home);