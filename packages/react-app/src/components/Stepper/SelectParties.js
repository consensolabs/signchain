/* eslint-disable */


import React, {useState} from 'react'
import './SlectParties.css'
import { Dropdown,Checkbox } from 'semantic-ui-react'
import jenny from '../../images/jenny.jpg'

  const SelectParties = ({users, setParties}) => {

    console.log(users)
      
    
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

              <div style={{marginBottom:'14px', float:'left'}}>
                 <Checkbox label='Add Notary (optional)' />
           </div>
                
              
   </div>
 
    </div>

)
                }

export default SelectParties