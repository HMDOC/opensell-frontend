import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import "../../../css/component/part/AdView/AdInfosPart.scss";
import { AdShape, getShapeStr } from "../../../entities/dto/AdBuyerView";
import { faClock, faLocationDot, faPhone, faShapes } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

function SingleInfo(props: { icon: IconProp, labelValue: string, isEnd?: boolean }) {
    return (
        <>
            {props.labelValue ?
                (
                    <>
                        <div className="single-info-flex" >
                            <FontAwesomeIcon size="2x" icon={props.icon} />
                            <p>{props.labelValue}</p>
                        </div>
                        
                        {props.isEnd ? 
                            <></> : <hr />
                        }
                    </>
                ) : (
                    <></>
                )
            }
        </>
    );
}

export default function AdInfosPart(props: { location: string, publishDate: Date, phone: string, shape: AdShape }) {
    return (
        <div className="ad-info-part dark-shadow">
            {/* Address */}
            <SingleInfo labelValue={props.location} icon={faLocationDot} />
            <SingleInfo labelValue={props.publishDate?.toString()} icon={faClock} />
            <SingleInfo labelValue={props.phone} icon={faPhone} />
            <SingleInfo labelValue={getShapeStr(props.shape)} icon={faShapes} isEnd />
        </div>
    );
}