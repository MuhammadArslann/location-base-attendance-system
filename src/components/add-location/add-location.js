import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import './add-location.css';
import axios from 'axios';

const Marker = ({ text }) => <div>
  <img className="marker" src="/images/marker.png" /></div>;

class SimpleMap extends Component {
  
  state = { center: { lat: '', lng: '' }, createdOn: [] } 
  componentDidMount = () => {
    window.navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos);
      this.setState({
        center: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
      });
    })
  }

  static defaultProps = {
    center: {
      lat: '',
      lng: ''
    },
    zoom: 15
  };

  render() {
    return this.state.center.lat == '' ? <div></div> :
      <>
      <br/>
        <div className="row">
          <div className="col s8">
            <input type="text" id='address' placeholder="Addres" />
          </div>
          <div className="col s4">
            <button className='btn' onClick={async(props)=>{
              
              let add=document.getElementById('address').value;
              let lng=document.getElementById('longitude').value
              if(add==''){
                alert('Enter the required Address....!')
              }else if(lng==''){
                alert('Please Select the Desired Location....!')
              }else{
                let data={
                  address: add,
                  position: this.state.createdOn[0]
                }
                console.log(data)
                let resp = await axios.post('/add-location',data);
                console.log(resp)
                this.props.history.push('/')
              }
            }}>Save Location</button>
          </div>
          <div className="col s5" style={{display:'none'}}>
            <input type="text" id='longitude' placeholder="Longiitude" value={this.state.createdOn[0] && this.state.createdOn[0].lng?  this.state.createdOn[0].lng:null} />
          </div>
          <div className="col s5" style={{display:'none'}}>
            <input type="text" id='lattitude' placeholder="Lattitude" value={this.state.createdOn[0] && this.state.createdOn[0].lat?  this.state.createdOn[0].lat:null}  />
          </div>
        </div>
        <div className="location-main" style={{ height: '80vh', width: '70vw' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDhElCEQpfCMHGiMqGB7Ys8ynnHO1mldrs' }}
            defaultCenter={this.state.center}
            defaultZoom={this.props.zoom}
            yesIWantToUseGoogleMapApiInternals
            onClick={({ lat, lng }) => {
              this.setState({
                createdOn: [{ lat, lng }]
              });
            }}
          >
            {this.state.createdOn.map((created) => {
              return <Marker
                lat={created.lat}
                lng={created.lng}
                text="My Marker"
              />;
            })}
          </GoogleMapReact>
        </div>
      </>
  }
}
export default SimpleMap;