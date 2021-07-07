import './visit-manager.css';
import {useState} from 'react';

export default function VisitManager() {

    let [locations, setLocation] = useState([]);

    return <div id="visitManager">

        <div>
                <button>Add Visit</button>
        </div>
        <table>
            {
                locations.map((location)=>{
                  <tr>
                      <td>

                      </td>
                  </tr>
                })
            }
        </table>

    </div>

}