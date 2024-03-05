import { Component, ReactNode, ChangeEvent, RefObject, createRef } from "react";
import { testImages } from "../../services/AdService";

export default class FileUploader extends Component {
    public fileInputRef: RefObject<HTMLInputElement> = createRef();
    
    public state: {customerImages: any} = {
        customerImages: [],
    };

    public addFile = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            customerImages: this.state.customerImages.concat(Array.from(this.fileInputRef.current.files))
        });
    }

    public submit() {
        let formData: FormData = new FormData();
        for (let file of this.state.customerImages) formData.append("files", file);

        testImages(formData).then(res =>
            console.log(res)
        );
    }

    public componentDidUpdate(): void {
    }

    public render(): ReactNode {
        return (
            <>
                <input ref={this.fileInputRef} onChange={this.addFile.bind(this)} type="file" multiple />

                {this.state.customerImages.map((image, index) => (
                    <img key={index} src={URL.createObjectURL(image)} />
                ))}

                <button onClick={this.submit.bind(this)}>submit</button>
            </>
        );
    }
}