import "./style.scss";

export default function AdTypePart(props: {type: string}) {
    return(
        <p className="ad-type-part">{props.type?.toUpperCase()}</p>
    );
}