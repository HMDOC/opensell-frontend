import "../../../css/component/part/AdView/AdTagPart.scss";

export default function AdTagPart({label = "", onDoubleClick = undefined, isAdView = false}) {
    return(
        <button style={{fontSize : isAdView ? "20px" : "16px"}} onDoubleClick={onDoubleClick ? onDoubleClick : null} className="ad-tag-part">#{label}</button>
    );
}