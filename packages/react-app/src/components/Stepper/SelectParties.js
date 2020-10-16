/* eslint-disable */


import React from 'react'
import './SlectParties.css'
import { Dropdown,Checkbox } from 'semantic-ui-react'

  const SelectParties = () => (
    <div className="parties__container">
        <div className="wrapper">
            <div style={{marginBottom:'14px'}}>
                <Dropdown
                placeholder='Select Party'
                fluid
                multiple
                search
                selection />
            </div>
            <div style={{marginBottom:'14px'}}>
                <Dropdown
                    placeholder='Select Storage Provider'
                    fluid
                    multiple
                    search
                    selection 
                    options={["AWS","Fleek"]}
                
                />
           </div>
              <div style={{marginBottom:'14px', float:'left'}}>
                 <Checkbox label='Add Notary (optional)' />
           </div>
                
              
   </div>
 
    </div>

)

export default SelectParties