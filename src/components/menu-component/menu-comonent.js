import './menu-component.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function MenuComponent(props) {


    return <div id="menuComponent">
        <ul>
            <li><Link to="/add-rap">Add New Employee</Link></li>
            <li><Link to="add-location">Add New Location</Link></li>
            <li><Link to="/show-raps">Show Employee</Link></li>
        </ul>
    </div> ;

}

export default connect((store) => {

    return store;

})(MenuComponent);