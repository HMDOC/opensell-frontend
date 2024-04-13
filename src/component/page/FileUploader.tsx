import { Component, ReactNode, ChangeEvent, RefObject, createRef } from "react";
import { NumberSchema, StringSchema } from "yup";

function notEmptyWithMaxAndMin(max: number, min: number) {
    return new NumberSchema()
        .required(" cannot be empty")
        .max(max, ` length cannot be more than ${max}`)
        .min(min, ` length cannot be less than ${min}`);
}

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
        var b = notEmptyWithMaxAndMin(10, 2);

        b.validate(e.target.value).then(res => {
            if (this.state.error.length != 0) {
                this.setState({ error: "" });
            }
        }).catch(e => {
            this.setState({ error: e.message });
        });
    }

    public render(): ReactNode {
        return (
            <div className="main-background">
                <input ref={this.fileInputRef} onChange={this.addFile.bind(this)} type="file" multiple />

                <br />
                <label>Test: </label>
                <br />
                {this.state.error.length != 0 ? this.state.error : ""}
                <br />
                <input defaultValue={"123"} onChange={(e) => this.handleChange(e)} />
                <input type="number" onChange={(e) => this.handleChange(e)} />

                {this.state.customerImages.map((image, index) => (
                    <p></p>
                ))}

                <button onClick={this.submit.bind(this)}>submit</button>
            </div>
        );
    }
}