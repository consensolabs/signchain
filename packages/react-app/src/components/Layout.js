/* eslint-disable */
import React, {Component} from "react";
import { useHistory } from "react-router-dom";
import Header from "./HeaderSem";


export default function Layout(props) {

    console.log(props)

    let history = useHistory()

    return (

        ['/login', '/signup'].includes(history.location.pathname) ?
            null :
            <div>
                <Header {...props}/>
                <div>
                    { props.children }
                </div>
            </div>
    )
}
