import { Component, ReactNode, ChangeEvent, RefObject, createRef } from "react";
import { adR, testImages } from "../../services/AdService";

export default class FileUploader extends Component {
    public fileInputRef: RefObject<HTMLInputElement> = createRef();

    public state = {
        customerImages: [],
    };

    public addFile = (e: ChangeEvent<HTMLInputElement>) => {
        var inputFiles = Array.from(this.fileInputRef.current.files);
        console.log(adR(inputFiles[0]));
        //console.log(inputFiles[0].arrayBuffer().then(res => adR(res)));
        this.setState({customerImages: inputFiles})
    }

    public submit() {
        let formData: FormData = new FormData();
        for (let file of this.state.customerImages) formData.append("files", file);

        testImages(formData).then(res =>
            console.log(res)
        );
    }

    public componentDidUpdate(): void {
        console.log(this.state.customerImages);
    }

    public render(): ReactNode {
        return (
            <div className="main-background">
                <input ref={this.fileInputRef} onChange={this.addFile.bind(this)} type="file" multiple />

                {this.state.customerImages.map((image, index) => (
                    <p></p>
                ))}

                <button onClick={this.submit.bind(this)}>submit</button>
            </div>
        );
    }
}