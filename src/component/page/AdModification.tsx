import { ChangeEvent, PureComponent, ReactElement, ReactNode, RefObject, createRef, memo, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdToModif, adModification, adModificationImageOrTags } from "../../services/AdService";
import { HtmlCode } from "../../services/verification/HtmlCode";
import "../../css/component/page/AdModif.css";
import {
    InputType,
    ModifType,
    SelectorReader,
    SelectorReaderProps, SHAPE_ARRAY,
    SimpleInput,
    SimpleInputProps, VISIBILITY_ARRAY,
} from "../shared/SharedAdPart";
import { AdTags } from "../shared/AdTags";

const SIMPLE: Array<SimpleInputProps> = [
    {
        name: "title",
        type: InputType.DEFAULT,
        modifType: ModifType.TITLE,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "reference",
        type: InputType.DEFAULT,
        modifType: ModifType.REFERENCE,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "price",
        type: InputType.DEFAULT,
        modifType: ModifType.PRICE,
        isNumber: true,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "adType",
        type: InputType.DEFAULT,
        modifType: ModifType.AD_TYPE,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "address",
        type: InputType.DEFAULT,
        modifType: ModifType.ADDRESS,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "isSold",
        type: InputType.ONE_CHECKBOX,
        modifType: ModifType.IS_SOLD,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }, {
        name: "description",
        type: InputType.TEXTARIA,
        modifType: ModifType.DESCRIPTION,
        getErrorType(error) {
            switch (error) {
                case HtmlCode.SUCCESS: return "";
                case HtmlCode.LESS_THAN_ZERO: return " cannot be empty.";
                case HtmlCode.LENGTH_OVERFLOW: return " the length cannot be more than ";
            }
        },
        checkValue(value) {
            // To check the errors.
            if (true /* condition */) {
                return HtmlCode.SUCCESS;
            }
        }
    }
];

const SELECTS: Array<SelectorReaderProps> = [
    {
        name: "visibility",
        options: VISIBILITY_ARRAY,
        request(value, idAd) {
            return adModification(ModifType.VISIBILITY, value, idAd)
        }
    },
    {
        name: "shape",
        options: SHAPE_ARRAY,
        request(value, idAd) {
            return adModification(ModifType.SHAPE, value, idAd)
        }
    },
];

interface AdTagsProps {
    tags: Array<string>;
    idAd: number;
    delete(tag: string): void;
    add(tag: string): void;
    reset(tags: Array<string>): void;
}


class AdImages extends PureComponent<{ images: Array<string> }> {
    public objectUrls: Array<string> = [];

    public addUrl(file: any): any {
        let url = URL.createObjectURL(file);
        this.objectUrls.push(url);
        return url;
    }

    public state = {
        images: this.props.images
    };

    public componentWillUnmount(): void {
        for (let url of this.objectUrls) URL.revokeObjectURL(url);
    }

    public handleChange(e: ChangeEvent<HTMLInputElement>): void {
        // this.setState({ images: this.state.images.concat(Array.from(e.target.files)) });
        e.target.value = null;
    }
    // Dealing with Image
    public render(): ReactNode {
        console.log(this.state.images)
        return (
            <>
                <label>adImages:</label>
                <br />
                <input onChange={(e) => this.handleChange(e)} type="file" multiple />
                <br />
                <br />
                {/* {this.state.images?.map((image, index) => (
                    image.isPath ?
                        (
                            <img style={{ width: "250px" }} key={`image-${index}`} src={image.object} />

                        ) : (
                            <img style={{ width: "250px" }} key={`image-${index}`} src={this.addUrl(image.object)} />
                        )
                ))} */}
                <br />
                <br />

            </>
        );
    }
}


// { name: "images", multiple: true, reference: createRef(), isFile: true },
export default function AdModification(): ReactElement {
    const { link } = useParams();
    const [ad, setAd] = useState<AdModifView>(undefined);
    const navigate = useNavigate();
    const [adImagesPath, setAdImagesPath] = useState<Array<string>>();
    var adImagesRef: RefObject<AdImages> = useRef(null);
    const [adTags, setAdTags] = useState<Array<string>>(undefined);
    const [error, setError] = useState<HtmlCode>(HtmlCode.SUCCESS);

    const [oldTags, setOldTags] = useState({
        isOldValueSaved : false,
        tagsForReset: []
    });

    useEffect(() => {
        getAdToModif(link).then(res => {
            // il faut aussi gérer les anciens images.
            if (res?.data) {
                setAdImagesPath(res?.data?.adImagesPath);
                setAd(res?.data);
                setAdTags(res?.data.adTags);
            }

            else navigate("/not-found");
        });
    }, []);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    function registerOldTags() {
        if (!oldTags.isOldValueSaved) {
            setOldTags({tagsForReset : adTags, isOldValueSaved : true});
            console.log(oldTags);
        }

        if (!isEditing) setIsEditing(true);
    }

    function reset(isReset: boolean = true) {
        setOldTags({...oldTags, isOldValueSaved : false});
        if(isReset) setAdTags(oldTags.tagsForReset);
        setIsEditing(false);
        setError(HtmlCode.SUCCESS);
    }

    function save() {
        adModificationImageOrTags(adTags, ad?.idAd, false).then(res => {
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
                        checkValue={(value: any) => { if (value) return HtmlCode.SUCCESS; else if (!value) return HtmlCode.LENGTH_EMPTY; }}
                        getErrorType={(error) => { if (error == 1) return " cannot be empty."; else if (error == 2054) return " is already in use with annother of your ad." }} />
                ))}

                <AdImages ref={adImagesRef} images={adImagesPath} />

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

                {
                    SELECTS.map((value, index) => (
                        <SelectorReader
                            key={`select-${index}`}
                            idAd={ad?.idAd}
                            value={ad?.[value?.name]}
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