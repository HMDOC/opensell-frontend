import { DESKTOP_VIEW } from "@context/AppContext";
import { Box, Stack, Button } from "@mui/material";
import { Component, ReactNode } from "react";

export default class NotFound extends Component<{}> {
    public render(): ReactNode {
        return(
            <div className="main-background d-flex"  style={{width:"90vw", maxWidth:"70em", height:"fit-content"}}>
                <title>Not Found</title>
                <Stack direction="row">
                    <div style={{width:"70%"}} className="d-flex">
                        <div style={{ marginTop:"15vh"}}>
                            <h1 className="mb-4"><b>404 Not-Found</b></h1> 
                            <p className="mb-4" style={ {marginRight: "2em"} } >
                                This page does not exist. 
                                Make sure the link you're using doesn't have a typo, or any other plausible mistake.
                            </p>
                            <Button href="/">Home</Button>
                            
                        </div>
                    </div>
                    <Box style={{width:"50%"}} sx={{ display: DESKTOP_VIEW }}>
                            <img style={{width:"100%", height:"100%"}} className="float-right" src="/img/auth-deco.jpg" alt="" />
                    </Box>
                    
                </Stack>
            </div>
        );
    }
}