import { SmallAd } from "@components/shared/ad/small-ad";
import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";

/**
 * The preview component for the Ads. Clicking on it will
 * 
 * @author Davide
 * @modifiedBy Achraf
*/
export default function AdPreview(props: AdPreviewDto) {
    return (
        <SmallAd
            {...props}
            isSearch
            goToAd={() => {
                window.open(`/ad/${props?.id}`, "_blank", "noreferrer")
            }}
        />
    )
}