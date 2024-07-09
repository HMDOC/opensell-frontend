import { AdImage } from "@entities/dto/AdBuyerView";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { Box, Container, Dialog, DialogContent } from "@mui/material";

export default function ImageViewer(props: { open: boolean, onClose: any, currentPicture: number, adImages?: Array<AdImage>, nextOrPrevious: any }) {
    return (
        <Dialog
            fullScreen
            open={props.open}
            onClose={props.onClose}>
            <DialogContent>
                <ClearRoundedIcon sx={{ cursor: "pointer" }} onClick={props.onClose} fontSize="large" />

                <Container>
                    <Box sx={{
                        backgroundImage: `url(${props.adImages?.[props.currentPicture]?.path})`,
                        height: "800px",
                        width: "1200px",
                        border: "20px solid red",
                        backgroundSize: "100%",
                        alignItems: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "blue"
                    }
                    } />

                    <div className="ad-view-popup-controls">
                        <button className="ad-view-popup-image-change-btn" onClick={() => props.nextOrPrevious(false)}>
                            <img style={{ rotate: "180deg" }} src="/img/prev-img.webp"></img>
                        </button>

                        <p className="ad-view-popup-image-count">{props.currentPicture + 1} / {props.adImages?.length}</p>

                        <button className="ad-view-popup-image-change-btn" onClick={() => props.nextOrPrevious(true)}>
                            <img src="/img/prev-img.webp"></img>
                        </button>
                    </div>
                </Container>
            </DialogContent>
        </Dialog >
    );
}