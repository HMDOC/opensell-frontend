import "../../../css/component/part/AdView/AdPricePart.scss";

export default function AdPricePart({price = 0, isSold = true}) {
    return(
        <div className="ad-price-part">
            <div className={`ad-price-part-title ${isSold ? "ad-price-part-sold" : ""}`}>{price.toString()} $</div>
            
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