import { Component, ReactNode } from "react";
import Modal from "react-modal";
import AdCreation from "../page/AdCreation";
import { AdCreationpProperties } from "../../services/AdCreationService";

interface AdCreationModalState {

}

interface AdCreationModalProperties extends AdCreationpProperties {
    isOpen: boolean;
    onCloseRequest(): void;
}

export default class AdCreationModal extends Component<AdCreationModalProperties, AdCreationModalState> {
    constructor(properties: AdCreationModalProperties) {
        super(properties)
    }

    render(): ReactNode {
        return(
            <Modal 
            isOpen={this.props.isOpen}
            shouldCloseOnEsc={true}
            ariaHideApp={false}
            onRequestClose={() => this.props.onCloseRequest()}
            style={{content: {width: '55vw', margin: "auto"}, 
                    overlay: {backdropFilter: 'blur(3px)'}}}>
                    <AdCreation idCustomer={this.props.idCustomer}/>
            </Modal>
        )
    }
}