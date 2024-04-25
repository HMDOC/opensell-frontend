import "../../../css/component/part/AdView/AdTagPart.scss";

export default function AdTagPart({label = ""}) {
    return(
        <button className="ad-tag-part">#{label}</button>
    );
}