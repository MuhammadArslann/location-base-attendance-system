import axios from "axios";
import { useEffect, useState } from "react";
import AddVisit from '../addVisit/addVisit';
import M from 'materialize-css';

export default function (props) {

    let [visits, setVisits] = useState([]);
    let [user, setUser] = useState({locations:[]});


    useEffect(() => {

        axios.post('/loadvisits', { id: props.match.params.id }).then((resp) => {

            if (resp.data.success) {
                setVisits(resp.data.visits);
                setUser(resp.data.user);
            }
        });



    }, []);

    const cancelVisit = (id) => {

        if (window.confirm("Are you sure, you want to cancel this visit?")) {

            axios.post('/cancel-visit', { id }).then(() => {

                setVisits(visits.filter((visit) => {
                    return visit._id != id;
                }))

            }).catch((err) => {

                alert("Oops, some error occurred");
            });

        }

    }

    return <div>
        <AddVisit user={user} targetUser={props.match.params.id} onVisitSaved={(visit) => {

            setVisits([...visits, visit]);
            M.Modal.init(document.getElementById('addVisitModal'), {}).close();

        }} />
        <button className="btn" onClick={() => {

            M.Modal.init(document.getElementById('addVisitModal'), {}).open();

        }}>Add Visit</button>
        <table>
            <thead>
                <tr>
                    <th>Sr.</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Manage</th>
                </tr>
            </thead>
            {
                visits.map((visit, index) => {
                    return <tr> <td>{index + 1}</td> <td>{visit.locationName}</td><td>{visit.date}</td><td>{!visit.verified ? "Pending" : "Completed"}</td> 
                    <td>  
                        <button className="btn" onClick={()=>{

                        cancelVisit(visit._id);

                    }}>Delete</button></td> </tr>
                })
            }
        </table>
    </div>

}