import { SmallAd } from "@components/shared/ad/small-ad";
import "./style.css";

type AdPreviewProps = {
    link: string;
    isSold?: boolean;
    firstImagePath: string;
    title: string;
    price: number;
    shape: number;
};

/**
 * The preview component for the Ads. Clicking on it will
 * 
 * @author Davide
 * @modifiedBy Achraf
*/
export default function AdPreview(props: AdPreviewProps) {
    return (
        <SmallAd
            className="adPreview"
            {...props}
            firstImage={props.firstImagePath}
            isSearch
            goToAd={() => {
                window.open(`/ad/${props?.link}`, "_blank", "noreferrer")
            }}
        />
    )
}