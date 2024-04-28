import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MARGIN_RIGHT = "3px";

export default function IconLabelError(props: { iconProp: IconProp, title: string, error?: string, isTitle?: boolean }) {
    return (
        <label style={{display : "flex", alignItems : "center"}}>
            <FontAwesomeIcon style={{fontSize : props.isTitle ? "22px" : "", marginRight : MARGIN_RIGHT}} icon={props.iconProp} />

            <span style={{fontSize : props.isTitle ? "22px" : "16px", marginRight : MARGIN_RIGHT}}>{props.title}</span>

            {props.error ?
                (
                    <span style={{ color: "red" }}>
                        {props.error}
                    </span>
                ) : (<></>)
            }
        </label>
    );
}