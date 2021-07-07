import { useEffect, useState } from "react";
import './addVisit.css';
import axios from 'axios';

export default function AddVisit(props) {

    let [visit, setVisit] = useState({});
    let [locations, setLocations] = useState([]);

    useEffect(() => {

        if (!locations.length) {
            axios.post('/get-locations').then((resp) => {
                setLocations(resp.data.locations)
            });
        }

    }, []);

    const setValue = (evt) => {

        visit[evt.target.name] = evt.target.value;

        if(evt.target.selectedOptions && evt.target.selectedOptions[0].innerText != "Select Location"){
            visit.locationName = evt.target.selectedOptions[0].getAttribute('data-name');
        }

    }

    const onSubmit = (evt) => {

        evt.preventDefault();

        if (!visit.date) {
            return alert("Please select a date");
        }

        if (!visit.location) {
            return alert("Please select a location");
        }

        visit.user = props.targetUser;

        axios.post('/save-visit', visit).then((resp) => {

            alert("Visit assigned!");
            props.onVisitSaved(resp.data);

        }).catch((error) => {

            alert('Visit could not be assigned');

        });

    }

    return <div id="addVisitModal" class="modal">
        <div class="modal-content">
            <form onSubmit={onSubmit}>
                <div className="row">
                    <div class="input-field col s6">
                        <input id="date" name="date" onChange={setValue} type="date" />
                        <label for="date">Date</label>
                    </div>
                </div>

                <div className="row">
                    <div class="input-field col s6">
                        <select name="location" id="location" onChange={setValue}>
                            <option>Select Location</option>
                            {
                                locations.filter((location)=>{

                                    return props.user.locations.indexOf(location._id) != -1;

                                }).map((location) => {
                                    return <option value={location._id} data-name={location.address}>{location.address}</option>
                                })
                            }
                        </select>

                    </div>
                </div>

                <div className="row">

                    <div class="input-field col s12">
                        <button className="btn">Save</button>
                    </div>

                </div>
            </form>
        </div>
    </div>

}