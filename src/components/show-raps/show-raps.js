import axios from 'axios';
import { useEffect, useState } from 'react';
import './show-raps.css';
export default function ShowRaps(props) {

    let [raps, setRaps] = useState([]);

    useEffect(() => {

        axios.post('/showraps').then((resp) => {

            if (resp.data.success) {
                setRaps(resp.data.raps);
            }

        });

    });

    return <div className="show-raps">

        <table>
            <thead>
                <tr>
                    <th>Sr.</th>
                    <th>Name</th>
                    <th>Pic</th>
                    <th>Email</th>
                    <th>Visits</th>
                    <th>Manage Users</th>
                </tr>
            </thead>
            {
                raps.map((rap, index) => {
                    return <tr>
                        <td>{index+1}</td>
                        <td>{rap.name}</td>
                        <td><img style={{width:'70px'}}src={rap.pics[0]} /></td>
                        <td>{rap.email}</td>
                        <td><button className="btn" onClick={() => {
                            props.history.push("/visits/" + rap._id);
                        }}>Visits</button></td>
                        <td>
                        <button className="btn" onClick={() => {
                            props.history.push("/edit/" + rap._id);
                        }}>Edit</button>
                        </td>
                    </tr>
                })
            }
        </table>

    </div>

}