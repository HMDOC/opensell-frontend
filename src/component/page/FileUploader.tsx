import { Component, ReactNode, ChangeEvent, RefObject, createRef } from "react";
import { testImages } from "../../services/AdService";

export default class FileUploader extends Component {
    public fileInputRef: RefObject<HTMLInputElement> = createRef();
    
    public state = {
        customerImages: [],
    };

    public addFile = (e: ChangeEvent<HTMLInputElement>) => {
        var reader = new FileReader();
        var inputFiles = Array.from(this.fileInputRef.current.files);
        var isLoading = false;

        reader.onload = () => {
            this.setState(
                {customerImages : this.state.customerImages.concat(reader.result)}
            );
        }

        for(var file of inputFiles) {
            /*new Promise().then(

            );*/
            reader.readAsDataURL(file);
        }
        
        /*this.setState({
            customerImages: this.state.customerImages.concat(Array.from(this.fileInputRef.current.files))
        });*/
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
            <>
                <input ref={this.fileInputRef} onChange={this.addFile.bind(this)} type="file" multiple />

                {this.state.customerImages.map((image, index) => (
                    <img key={index} src={image} />
                ))}

                <button onClick={this.submit.bind(this)}>submit</button>
            </>
        );
    }
}