import { faItalic, faLocationDot, faReceipt, faSackDollar, faScroll } from "@fortawesome/free-solid-svg-icons";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BooleanSchema, NumberSchema, StringSchema } from "yup";
import { AdImages, SaveCancelButton } from "../../components/ad-images";
import AdShapeSelect from "../../components/shared/AdShapeSelect";
import { AdTags } from "../../components/shared/AdTags";
import AdTypeSelect from "../../components/shared/AdTypeSelect";
import AdVisibilitySelect from "../../components/shared/AdVisibilitySelect";
import {
    InputType,
    ModifType,
    SimpleInput,
    SimpleInputProps
} from "../../components/shared/SharedAdPart";
import { AdModifView } from "../../entities/dto/AdModifView";
import { BlockImage } from "../../entities/dto/BlockImages";
import { adModification, adModificationTags, getAdToModif } from "../../services/AdService";
import { createRandomKey } from "../../services/RandomKeys";
import { HtmlCode } from "../../services/verification/HtmlCode";
import "./style.scss";

export function notEmptyWithMaxAndMin(max: number, min: number, label?: string) {
    return new StringSchema()
        .required(`${label ?? ""} is required`)
        .max(max, `${label ?? ""} length cannot be more than ${max}`)
        .min(min, `${label ?? ""} length cannot be less than ${min}`);
}

export function priceWithMinAndMax(max: number, min: number, label?: string) {
    return new NumberSchema()
        // To do not get a error if the user put the input empty
        .transform( cv => isNaN(cv) ? undefined : cv)
        .max(max, `${label ?? ""} cannot be more than ${max}`)
        .min(min, `${label ?? ""} cannot be less than ${min}`)
        .required(`${label ?? ""} is required`);
}

const SIMPLE: Array<SimpleInputProps> = [
    {
        name: "adTitle",
        iconProp: faItalic,
        title: "Title",
        modifType: ModifType.TITLE,
        verifyProperty: notEmptyWithMaxAndMin(80, 3)
    }, {
        name: "adPrice",
        iconProp: faSackDollar,
        title: "Price",
        modifType: ModifType.PRICE,
        isNumber: true,
        verifyProperty: priceWithMinAndMax(Number.MAX_VALUE, 0)
    },
    {
        name: "adAddress",
        iconProp: faLocationDot,
        title: "Address",
        modifType: ModifType.ADDRESS,
        verifyProperty: notEmptyWithMaxAndMin(256, 4)
    },
    {
        name: "isAdSold",
        iconProp: faReceipt,
        title: "IsSold",
        type: InputType.ONE_CHECKBOX,
        modifType: ModifType.IS_SOLD,
        verifyProperty: new BooleanSchema()
    }
];


export const SimpleInputPart = ({ start = 0, end = 2, ad }): any => {
    return (
        <div style={{display : "flex"}}>
            {SIMPLE.slice(start, end).map(value => (
                <div style={{marginRight : "40px"}} key={createRandomKey()}>
                    <SimpleInput
                        iconProp={value?.iconProp}
                        title={value.title}
                        defaultValue={ad?.[value.name]}
                        modifType={value?.modifType}
                        idAd={ad?.idAd}
                        name={value?.name}
                        type={value?.type}
                        isNumber={value?.isNumber}
                        verifyProperty={value.verifyProperty} />
                </div>
            ))}
        </div>
    );
}

// { name: "images", multiple: true, reference: createRef(), isFile: true },
export default function AdModification(): ReactElement {
    const { link } = useParams();
    const [ad, setAd] = useState<AdModifView>(undefined);
    const navigate = useNavigate();
    const [adTags, setAdTags] = useState<Array<string>>(undefined);
    const [errorTags, setErrorTags] = useState<HtmlCode>(HtmlCode.SUCCESS);
    const [adImages, setAdImages] = useState<Array<BlockImage>>([]);
    const [errorImages, setErrorImages] = useState<string>();
    console.log(ad);
    const [oldTags, setOldTags] = useState({
        isOldValueSaved: false,
        tagsForReset: []
    });

    useEffect(() => {
        getAdToModif(link).then(res => {
            // il faut aussi gérer les anciens images.
            if (res?.data) {
                setAd(res?.data);
                setAdTags(res?.data.adTagsName);
                setAdImages(BlockImage.fromBackend(res?.data.adImages));
            }

            else navigate("/not-found");
        });
    }, []);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    function registerOldTags() {
        if (!oldTags.isOldValueSaved) {
            setOldTags({ tagsForReset: adTags, isOldValueSaved: true });
            console.log(oldTags);
        }

        if (!isEditing) setIsEditing(true);
    }

    function reset(isReset: boolean = true) {
        setOldTags({ ...oldTags, isOldValueSaved: false });
        if (isReset) setAdTags(oldTags.tagsForReset);
        setIsEditing(false);
        setErrorTags(HtmlCode.SUCCESS);
    }

    function save() {
        adModificationTags(adTags, ad?.idAd).then(res => {
            if (res?.data === HtmlCode.SUCCESS) {
                reset(false);
            }
        });
    }

    function addEvent(tag: string) {
        registerOldTags();
        setAdTags([...adTags, tag]);
    }

    function deleteEvent(tag: string) {
        registerOldTags();
        setAdTags(adTags.filter(t => t !== tag));
    }

    return (
        <div className="ad-modif-div">
        <title>Modify my ads</title>
        <div className="reg-background" style={{overflowY : "scroll", height :"90vh"}}>
            <>
                <SimpleInputPart ad={ad} />
                <SimpleInputPart ad={ad} start={2} end={4} />

                <SimpleInput
                    defaultValue={ad?.adDescription}
                    iconProp={faScroll}
                    title="Descripiton"
                    modifType={ModifType.DESCRIPTION}
                    idAd={ad?.idAd}
                    name={"adDescription"}
                    type={InputType.TEXTARIA}
                    verifyProperty={notEmptyWithMaxAndMin(5000, 10)}
                    key={createRandomKey()} />

                <AdImages
                    setError={setErrorImages}
                    error={errorImages}
                    idAd={ad?.idAd}
                    images={adImages}
                    setImages={setAdImages}
                    reset={(backup) => setAdImages(backup)}
                    removeImage={(link) => setAdImages(adImages.filter(img => img.link !== link))}
                    isModification={true}
                />

                <AdTags
                    error={errorTags}
                    setError={setErrorTags}
                    tags={adTags}
                    addTag={addEvent}
                    deleteTag={deleteEvent}
                />

                {isEditing ?
                    (
                        <>
                            <SaveCancelButton save={save} cancel={reset} />
                            <br /><br />
                        </>
                    ) : (<></>)

                }

                <br />

                <AdTypeSelect
                    inputName="AdType"
                    inputId="adType"
                    isModification
                    selectedIndex={ad?.adType?.idAdType}
                    externalOnChange={(type) => adModification(ModifType.AD_TYPE, type, ad?.idAd)} />
                <br />
                <br />

                <AdShapeSelect
                    defaultValue={ad?.adShape} 
                    request={(value: any) => adModification(ModifType.SHAPE, value, ad?.idAd)} />
                <AdVisibilitySelect 
                    defaultValue={ad?.adVisibility} 
                    request={(value: any) => adModification(ModifType.VISIBILITY, value, ad?.idAd)} />
            </>
        </div>
        </div>
    );
}