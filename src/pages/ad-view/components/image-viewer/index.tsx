import { AdImage } from "@entities/dto/AdBuyerView";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { Container, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";

const arrowStyle = {
    fontSize: "55px",
    color: "black"
};

export default function ImageViewer(props: { open: boolean, onClose: any, currentPicture: number, adImages?: Array<AdImage>, nextOrPrevious: any }) {
    return (
        <Dialog fullScreen open={props.open} onClose={props.onClose}>
            <DialogTitle>
                <ClearRoundedIcon sx={{ cursor: "pointer" }} onClick={props.onClose} fontSize="large" />
            </DialogTitle>

            <DialogContent>
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <IconButton onClick={() => props.nextOrPrevious(false)}>
                        <ArrowCircleLeftIcon sx={arrowStyle} />
                    </IconButton>

                    <Typography color="black" variant="h6">{props.currentPicture + 1} / {props.adImages?.length}</Typography>

                    <IconButton onClick={() => props.nextOrPrevious(false)}>
                        <ArrowCircleRightIcon sx={arrowStyle} />
                    </IconButton>
                </Stack>

                <Stack component={Container} justifyContent="center" alignItems="center">
                    <img style={{ width: "100%", height: "100%" }} src={props.adImages?.[props.currentPicture]?.path} />
                </Stack>
            </DialogContent>
        </Dialog>
    );
}