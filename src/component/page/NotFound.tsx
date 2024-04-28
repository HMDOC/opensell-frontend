import { Component, ReactNode } from "react";
import LoadingIcon from "../part/LoadingIcon"; 

export default class NotFound extends Component<{}> {
    public render(): ReactNode {
        return(
            <div className="main-background d-flex"  style={{width:"90vw", maxWidth:"70em", maxHeight:"80vh"}}>
                <div style={{width:"70%"}} className="d-flex">
                    <div style={{ marginTop:"15vh"}}>
                        <h1 className="mb-4"><b>404 Not-Found</b></h1> 
                        <p className="mb-4" style={ {marginRight: "2em"} } >
                            This page does not exist. 
                            Make sure the link you're using doesn't have a typo, or any other plausible mistake.
                            
                        </p>
                        <a className="btn bg-primary text-white" style={{width:"6em", height:"2.5em"}} href="/">Home</a>
                    </div>
                    
                </div>
                <div>
                    <img style={{width:"100%", maxHeight:"90vh"}} className="float-right" src="/img/auth-deco.jpg" alt="" />
                </div>
                
            </div>
        );
    }
}