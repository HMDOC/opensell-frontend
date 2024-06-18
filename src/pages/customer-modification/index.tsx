import { Component, ReactNode } from "react";
import Modal from "react-modal";
import { CMModalType } from "../../services/customerModification/CMService";
import { CMDisplay, CMProperties, CMState } from "../../services/customerModification/CMComponents";
import "./style.css"
import { CMBasicModificationsForm, CMIconForm, CMPasswordForm, CMPersonalEmailForm, CMPhoneNumberForm } from "../../services/customerModification/CMForm";
import ProfilIcon from "../../components/shared/ProfilIcon";

/**
 *
 * @author Olivier Mansuy
 * @Note 
 * https://www.w3schools.com/typescript/typescript_casting.php
 * https://javascript.plainenglish.io/promise-based-prop-in-react-78a77440f4fc
 * https://stackoverflow.com/questions/50094331/react-app-componentdidmount-not-getting-props-from-parent
 * https://blog.logrocket.com/types-vs-interfaces-typescript/
 * https://reactcommunity.org/react-modal/styles/
 *
 */
export default class CustomerModification extends Component<CMProperties, CMState> {
    constructor(properties: CMProperties) {
        super(properties);
        this.state = {
            modalIsOpen: false,
            currentModalContent: null
        }
    }

    public openModal(type: CMModalType): void {
        if (type === CMModalType.BASIC_CHANGES) this.setState({ currentModalContent: <CMBasicModificationsForm defaultValues={this.props.customerData} closeModalCallback={() => this.closeModal()} /> });
        else if (type === CMModalType.PERSONNAL_EMAIL) this.setState({ currentModalContent: <CMPersonalEmailForm defaultValues={this.props.customerData} closeModalCallback={() => this.closeModal()} /> });
        else if (type === CMModalType.PASSWORD) this.setState({ currentModalContent: <CMPasswordForm defaultValues={this.props.customerData} closeModalCallback={() => this.closeModal()} /> });
        else if (type === CMModalType.PHONE_NUMBER) this.setState({ currentModalContent: <CMPhoneNumberForm defaultValues={this.props.customerData} closeModalCallback={() => this.closeModal()} /> });
        else if (type === CMModalType.ICON) this.setState({ currentModalContent: <CMIconForm defaultValues={this.props.customerData} closeModalCallback={() => this.closeModal()} /> });
        this.setState({ modalIsOpen: true });
    }

    public closeModal(): void {
        this.setState({ modalIsOpen: false });
        this.props.refreshCallback();
    }

    render(): ReactNode {
        return (
            <div className="modificationContainer">
            <title>Settings</title>
                <div id="customer-modification-form" className="modificationPage">
                    <div className="CM-Container">
                        <div className="input-div">
                            <h1 style={{ width: "66.5%"}}>Sensitive Information</h1>
                            <span style={{fontSize : "1vw"}}><CMDisplay labelText="Private Email" hasButton={true} buttonOnClickCallback={() => this.openModal(CMModalType.PERSONNAL_EMAIL)} defaultValue={this.props.customerData.personalEmail} /></span>
                            <CMDisplay labelText="Password" hasButton={true} buttonOnClickCallback={() => this.openModal(CMModalType.PASSWORD)} isPassword={true} />
                            <CMDisplay labelText="Phone Number" hasButton={true} buttonOnClickCallback={() => this.openModal(CMModalType.PHONE_NUMBER)} defaultValue={this.props.customerData.customerInfo?.phoneNumber} />
                        </div>
                    </div>
                    <div className="CM-Container">
                        <div className="input-div">
                            <div className="CM-Title-Button-Container">
                                <h1>Other Information</h1>
                                <div className="change-button">
                                    <button type="button" onClick={() => this.openModal(CMModalType.BASIC_CHANGES)} className="modificationLabel">Change</button>
                                </div>
                            </div>
                            <CMDisplay labelText="Username" defaultValue={this.props.customerData.username} />
                            <CMDisplay labelText="FirstName" defaultValue={this.props.customerData.customerInfo?.firstName} />
                            <CMDisplay labelText="LastName" defaultValue={this.props.customerData.customerInfo?.lastName} />
                            <CMDisplay labelText="Public Email" defaultValue={this.props.customerData.customerInfo?.exposedEmail} />
                            <CMDisplay labelText="Bio" defaultValue={this.props.customerData.customerInfo?.bio} />
                        </div>
                    </div>
                    <div className="CM-Container">
                        <div className="input-div">
                            <div className="CM-Title-Button-Container">
                                <h1 style={{width : "fit-content", marginRight : "25px", border : "none"}}>Profile Icon</h1>
                                <div style={{border : "none"}} className="change-button">
                                <ProfilIcon src={this.props.customerData?.customerInfo?.iconPath}/>
                                    <button style={{marginLeft : "10px"}} className="modificationLabel" onClick={() => this.openModal(CMModalType.ICON)}>Change</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        shouldCloseOnEsc={true}
                        onRequestClose={() => this.closeModal()}
                        ariaHideApp={false}
                        style={{
                            content: {
                                width: "70vw", maxWidth: "60em",
                                height: "60vh",
                                minHeight: "24em",
                                top: '50%', left: '50%',
                                position: 'fixed',
                                transform: 'translate(-50%, -50%)',
                                background: 'rgba(252, 251, 250, 0.39)',
                                color: "#2e3440",
                                border: '2px solid blue'
                            }, overlay: { backdropFilter: 'blur(3px)' }
                        }}>
                        {this.state.currentModalContent}
                    </Modal>
                </div>
            </div>
        )
    }

}