/* eslint-disable */


import React, {useState} from 'react'
import './SlectParties.css'
import { Dropdown,Checkbox } from 'semantic-ui-react'
import jenny from '../../images/jenny.jpg'

  const SelectParties = ({users, parties, notaries, setParties, setDocNotary}) => {

    console.log(notaries)

    const [displayNotary, setDisplayNotary] = useState(false)
      
    
    return (
    <div className="parties__container">
        <div className="wrapper">
            <div style={{marginBottom:'14px'}}>
                <Dropdown
                placeholder='Select Party'
                fluid
                multiple
                search
                selection 
                options={users.map((user)=> {
                    return (
                        {
                            key: user.address,
                            text: user.name,
                            value: user,
                            image: { avatar: true, src: jenny },
                        }
                    )

                })}
                onChange={(event, data)=> setParties(data.value)}
                />
            </div>

            <div>
                 <Checkbox label='Add Notary (optional)' checked={displayNotary} onChange={() => {setDisplayNotary(!displayNotary)}} />
           </div>
           {
           displayNotary ? <div>
                <Dropdown
                placeholder='Select a Notary'
                fluid
                search
                selection 
                options={notaries.map((user)=> {
                    return (
                        {
                            key: user.address,
                            text: user.name,
                            value: user,
                            image: { avatar: true, src: jenny },
                        }
                    )

                })}
                onChange={(event, data)=> {
                    const allParties = parties;
                    allParties.push(data.value);
                    setParties(allParties); setDocNotary(data.value)}}
                />
            </div> : <div style={{marginBottom:'14px', float:'left'}} />
            }
                
              
   </div>
 
    </div>

)
                }

export default SelectParties