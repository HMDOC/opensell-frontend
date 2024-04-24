import "../../../css/component/part/AdView/AdPricePart.scss";

export default function AdPricePart({price = 0, isSold = true}) {
    return(
        <div className="ad-price-part">
            <p className={`ad-price-part-title ${isSold ? "ad-price-part-sold" : ""}`}>{price.toString()} $</p>
            
            {isSold ? 
                (
                    <p className="ad-price-part-box-sold">Sold</p>
                ) : (
                    <></>
                )
            }
        </div>
    );
}