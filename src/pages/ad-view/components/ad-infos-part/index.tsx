import AdShape, { getShapeStr } from '@model/enums/AdShape';
import InterestsIcon from '@mui/icons-material/Interests';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PlaceIcon from '@mui/icons-material/Place';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { Card, Divider, Stack, SvgIcon } from "@mui/material";

function SingleInfo(props: { icon: typeof SvgIcon, labelValue?: string, isEnd?: boolean }) {
    return (
        props.labelValue ?
            (
                <>
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                        <props.icon />
                        <p style={{ overflow: "auto" }}>{props.labelValue}</p>
                    </Stack>

                    {props.isEnd ? <></> : <Divider />}
                </>
            ) : (
                <></>
            )
    );
}

export default function AdInfosPart(props: { location?: string, publishDate?: Date, phone?: string, shape?: AdShape }) {
    return (
        <Stack component={Card} variant="outlined" spacing={1.5} padding={3} borderRadius="30px" maxWidth="300px">
            <SingleInfo labelValue={props.location} icon={PlaceIcon} />
            <SingleInfo labelValue={props.publishDate?.toString()} icon={WatchLaterIcon} />
            <SingleInfo labelValue={props.phone} icon={PhoneIphoneIcon} />
            <SingleInfo labelValue={getShapeStr(props.shape)} icon={InterestsIcon} isEnd />
        </Stack>
    );
}