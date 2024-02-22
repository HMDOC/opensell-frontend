import { Component, ReactNode, ChangeEvent, RefObject, createRef } from "react";
import { testImages } from "../../services/AdService";
import { AdImgSave } from "../dto/AdImgSave";

export default class AdModification extends Component {

    public fileInputRef: RefObject<HTMLInputElement> = createRef();

    public state: { customerImages: AdImgSave[] } = {
        customerImages: []
    };

    public addFile = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState(
            {
                customerImages: this.state.customerImages.concat(
                    { object: e.target.files, isPath: false }
                )
            });
    }

    public submit() {
        testImages(this.state.customerImages).then(res =>
            console.log(res?.data)
        );
    }

    public componentDidUpdate(): void {
        console.log(this.state.customerImages);
    }

    public render(): ReactNode {
        return (
            <>
                {/* <input ref={this.fileInputRef} onChange={this.addFile.bind(this)} type="file" multiple/> */}

                {/* {this.state.customerImages.map((image, index) => (
                    <img key={index} src={URL.createObjectURL(new Blob(image.object))} />
                ))} */}

                {/* <button onClick={this.submit.bind(this)}>submit</button> */}
            </>
        );
    }
}