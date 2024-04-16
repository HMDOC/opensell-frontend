import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/component/page/AdModif.css";
import { adModification, adModificationTags, getAdToModif } from "../../services/AdService";
import { HtmlCode } from "../../services/verification/HtmlCode";

import { boolean, BooleanSchema, NumberSchema, StringSchema } from "yup";
import { AdImage } from "../../entities/dto/AdBuyerView";
import { AdModifView } from "../../entities/dto/AdModifView";
import { createRandomKey } from "../../services/RandomKeys";
import { AdImages } from "../shared/AdImages";
import { AdTags } from "../shared/AdTags";
import AdTypeSelect from "../shared/AdTypeSelect";
import {
    InputType,
    ModifType,
    SelectorReader,
    SelectorReaderProps, SHAPE_ARRAY,
    SimpleInput,
    SimpleInputProps, VISIBILITY_ARRAY,
} from "../shared/SharedAdPart";

function notEmptyWithMaxAndMin(max: number, min: number) {
    return new StringSchema()
        .required(" cannot be empty")
        .max(max, ` length cannot be more than ${max}`)
        .min(min, ` length cannot be less than ${min}`);
}

function priceWithMinAndMax(max: number, min: number) {
    return new NumberSchema()
        .max(max, ` cannot be more than ${max}`)
        .min(min, ` cannot be less than ${min}`)
        .typeError(" is a number");
}

const SIMPLE: Array<SimpleInputProps> = [
    {
        name: "adTitle",
        type: InputType.DEFAULT,
        modifType: ModifType.TITLE,
        verifyProperty: notEmptyWithMaxAndMin(80, 3)
    }, {
        name: "adPrice",
        type: InputType.DEFAULT,
        modifType: ModifType.PRICE,
        isNumber: true,
        verifyProperty: priceWithMinAndMax(Number.MAX_VALUE, 0)
    },
    {
        name: "adAddress",
        type: InputType.DEFAULT,
        modifType: ModifType.ADDRESS,
        verifyProperty: notEmptyWithMaxAndMin(256, 4)
    }, {
        name: "isAdSold",
        type: InputType.ONE_CHECKBOX,
        modifType: ModifType.IS_SOLD,
        verifyProperty: new BooleanSchema()
    }, {
        name: "adDescription",
        type: InputType.TEXTARIA,
        modifType: ModifType.DESCRIPTION,
        verifyProperty: notEmptyWithMaxAndMin(5000, 10)
    }
];

const SELECTS: Array<SelectorReaderProps> = [
    {
        name: "adVisibility",
        options: VISIBILITY_ARRAY,
        request(value, idAd) {
            return adModification(ModifType.VISIBILITY, value, idAd)
        }
    },
    {
        name: "adShape",
        options: SHAPE_ARRAY,
        request(value, idAd) {
            return adModification(ModifType.SHAPE, value, idAd)
        }
    },
];

// { name: "images", multiple: true, reference: createRef(), isFile: true },
export default function AdModification(): ReactElement {
    const { link } = useParams();
    const [ad, setAd] = useState<AdModifView>(undefined);
    const navigate = useNavigate();
    const [adTags, setAdTags] = useState<Array<string>>(undefined);
    const [error, setError] = useState<HtmlCode>(HtmlCode.SUCCESS);
    const [adImages, setAdImages] = useState<Array<AdImage>>([]);

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
                setAdImages(res?.data.adImages);
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
        setError(HtmlCode.SUCCESS);
    }

    function save() {
        adModificationTags(adTags, ad?.idAd).then(res => {
            if (res?.data == HtmlCode.SUCCESS) {
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
        setAdTags(adTags.filter(t => t != tag));
    }

    return (
        <div className="main-background">
            <>
                {SIMPLE.map(value => (
                    <SimpleInput
                        defaultValue={ad?.[value.name]}
                        modifType={value?.modifType}
                        idAd={ad?.idAd}
                        name={value?.name}
                        type={value?.type}
                        isNumber={value?.isNumber}
                        verifyProperty={value.verifyProperty} 
                        key={createRandomKey()} />
                ))}

                <AdImages
                    idAd={ad?.idAd}
                    images={adImages}
                    reset={(backup) => setAdImages(backup)}
                    removeImage={(path) => setAdImages(adImages.filter(img => img.path != path))}
                    isModification={true}
                />

                <AdTags
                    error={error}
                    setError={setError}
                    tags={adTags}
                    addTag={addEvent}
                    deleteTag={deleteEvent}
                />

                {isEditing ?
                    (
                        <>
                            <button onClick={save}>save</button>
                            <button onClick={() => reset()}>cancel</button>
                            <br />
                            <br />
                        </>
                    ) : (<></>)

                }

                <label>AdType :</label>
                <AdTypeSelect
                    inputName="AdType"
                    inputId="adf"
                    isModification
                    selectedIndex={ad?.adType?.idAdType}
                    externalOnChange={(type) => adModification(ModifType.AD_TYPE, type, ad?.idAd)} />
                <br />
                <br />

                {
                    SELECTS.map(value => (
                        <SelectorReader
                            key={createRandomKey()}
                            idAd={ad?.idAd}
                            defaultValue={ad?.[value?.name]}
                            name={value?.name}
                            options={value?.options}
                            request={value?.request}
                        />
                    ))
                }
            </>
        </div>
    );
}