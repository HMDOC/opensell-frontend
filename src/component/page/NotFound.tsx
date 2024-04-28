import { Component, ReactNode } from "react";
import LoadingIcon from "../part/LoadingIcon"; 
import { NavLink } from "react-router-dom";

export default class NotFound extends Component<{}> {
    public render(): ReactNode {
        return(
            <div className="main-background d-flex"  style={{width:"90vw", maxWidth:"70em", height:"67vh"}}>
                <div style={{width:"70%"}} className="d-flex">
                    <div style={{ marginTop:"15vh"}}>
                        <h1 className="mb-4"><b>404 Not-Found</b></h1> 
                        <p className="mb-4" style={ {marginRight: "2em"} } >
                            This page does not exist. 
                            Make sure the link you're using doesn't have a typo, or any other plausible mistake.
                            
                        </p>
                        <NavLink  style={{width:"6em", height:"2.5em", backgroundColor : "#232751", color : "#FCFBFA", fontSize : "1vw", padding : "0.3vw 15px", borderRadius : "10px", textDecoration : "none"}} to="/">Home</NavLink>
                    </div>
                    
                </div>
                <div>
                    <img style={{width:"100%", height:"100%"}} className="float-right" src="/img/auth-deco.jpg" alt="" />
                </div>
                
            </div>
        );
    }
}