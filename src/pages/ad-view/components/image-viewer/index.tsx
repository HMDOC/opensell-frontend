import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { Container, Dialog, DialogContent, DialogTitle, IconButton, Stack, SvgIcon, Typography } from "@mui/material";
import { getAdImageUrl } from '@services/file';

function ArrowButton(props: { icon: typeof SvgIcon, action(): void }) {
    return (
        <IconButton onClick={props.action}>
            <props.icon sx={{ fontSize: "55px", color: "text.primary" }} />
        </IconButton>
    );
}

export default function ImageViewer(props: { open: boolean, onClose: any, currentPicture: number, adImages?: Array<string>, nextOrPrevious: any }) {
    return (
        <Dialog fullScreen open={props.open} onClose={props.onClose}>
            <DialogTitle>
                <ClearRoundedIcon sx={{ cursor: "pointer" }} onClick={props.onClose} fontSize="large" />
            </DialogTitle>

            <DialogContent>
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <ArrowButton icon={ArrowCircleLeftIcon} action={() => props.nextOrPrevious(false)} />

                    <Typography variant="h6">{props.currentPicture + 1} / {props.adImages?.length}</Typography>

                    <ArrowButton icon={ArrowCircleRightIcon} action={() => props.nextOrPrevious(true)} />
                </Stack>

                <Stack component={Container} justifyContent="center" alignItems="center">
                    <img style={{ width: "100%", height: "100%" }} src={getAdImageUrl(props.adImages?.[props.currentPicture])} />
                </Stack>
            </DialogContent>
        </Dialog>
    );
}