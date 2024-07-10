import { AdShape, getShapeStr } from "@entities/dto/AdBuyerView";
import InterestsIcon from '@mui/icons-material/Interests';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PlaceIcon from '@mui/icons-material/Place';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { Stack } from "@mui/material";

function SingleInfo(props: { icon: any, labelValue?: string, isEnd?: boolean }) {
    return (
        props.labelValue ?
            (
                <>
                    <Stack direction="row" alignItems="center" spacing={0.4}>
                        {props.icon}
                        <p>{props.labelValue}</p>
                    </Stack>

                    {props.isEnd ? <></> : <hr />}
                </>
            ) : (
                <></>
            )
    );
}

export default function AdInfosPart(props: { location?: string, publishDate?: Date, phone?: string, shape?: AdShape }) {
    return (
        <Stack padding={3} borderRadius="30px" width="300px" className="dark-shadow" color="black">
            <SingleInfo labelValue={props.location} icon={<PlaceIcon />} />
            <SingleInfo labelValue={props.publishDate?.toString()} icon={<WatchLaterIcon />} />
            <SingleInfo labelValue={props.phone} icon={<PhoneIphoneIcon />} />
            <SingleInfo labelValue={getShapeStr(props.shape)} icon={<InterestsIcon />} isEnd />
        </Stack>
    );
}