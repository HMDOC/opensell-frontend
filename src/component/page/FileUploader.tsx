import { Component, ReactNode, ChangeEvent, RefObject, createRef } from "react";
import * as Yup from "yup";

export default class FileUploader extends Component {
    public fileInputRef: RefObject<HTMLInputElement> = createRef();

    public state = {
        customerImages: [],
        error: ""
    };

    public addFile = (e: ChangeEvent<HTMLInputElement>) => {
        var inputFiles = Array.from(this.fileInputRef.current.files);
        console.log("PATH : " + inputFiles[0].type);
        //inputFiles[0].text().then(res => adR(res));
        this.setState({ customerImages: inputFiles })
    }

    public submit() {
        let formData: FormData = new FormData();
        for (let file of this.state.customerImages) formData.append("files", file);
    }

    public componentDidUpdate(): void {
        console.log(this.state.customerImages);
    }

    public handleChange(e: any): void {
        Yup.string().min(0, " cannot be empty").max(10, "Max length").validate(e.target.value).then(res => {
            this.setState({ error: res })
        }
        );
    }

    public render(): ReactNode {
        return (
            <div className="main-background">
                <input ref={this.fileInputRef} onChange={this.addFile.bind(this)} type="file" multiple />

                <label>Test: </label>
                {!this.state.error ? this.state.error : ""}
                <input onChange={(this.handleChange)} />

                {this.state.customerImages.map((image, index) => (
                    <p></p>
                ))}

                <button onClick={this.submit.bind(this)}>submit</button>
            </div>
        );
    }
}