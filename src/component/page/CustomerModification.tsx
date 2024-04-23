import { Component, ReactNode } from "react";
import Modal from "react-modal";
import { getCustomerModificationView, CMModalType } from "../../services/customerModification/CMService";
import { CMBasicModificationsForm, CMDisplay, CMPasswordForm, CMPersonalEmailForm, CMPhoneNumberForm, CMProperties, CMState} from "../../services/customerModification/CMComponents";
import "../../css/component/page/CustomerModification.css"

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
            defaultValues: undefined,
            modalIsOpen: false,
            currentModalContent: null
        }
    }

    componentDidMount(): void {
        if (this.props.customerData.customerId) {
            getCustomerModificationView(this.props.customerData.customerId).then((rep) => {
                if (rep?.data) this.setState({defaultValues: rep?.data});
            })
        }
    }

    public openModal(type: CMModalType): void {
        if (type == CMModalType.BASIC_CHANGES) this.setState({currentModalContent: <CMBasicModificationsForm defaultValues={this.props.customerData}/>});
        else if (type == CMModalType.PERSONNAL_EMAIL) this.setState({currentModalContent: <CMPersonalEmailForm defaultValues={this.props.customerData}/>});
        else if (type == CMModalType.PASSWORD) this.setState({currentModalContent: <CMPasswordForm defaultValues={this.props.customerData}/>});
        else if (type == CMModalType.PHONE_NUMBER) this.setState({currentModalContent: <CMPhoneNumberForm defaultValues={this.props.customerData}/>});
        this.setState({modalIsOpen: true});
    }

    public closeModal(): void {
        this.setState({modalIsOpen: false});
    }

    render(): ReactNode {
        return (
            <div className="modificationContainer">
                <div id="customer-modification-form" className="main-background modificationPage">
                    <div className="CM-Container">
                        <h1>Sensitive Info</h1>
                        <CMDisplay labelText="Private Email" hasButton={true} buttonOnClickCallback={() => this.openModal(CMModalType.PERSONNAL_EMAIL)} isPassword={true}/>
                        <CMDisplay labelText="Password" hasButton={true} buttonOnClickCallback={() => this.openModal(CMModalType.PASSWORD)} isPassword={true}/>
                        <CMDisplay labelText="Phone Number" hasButton={true} buttonOnClickCallback={() => this.openModal(CMModalType.PHONE_NUMBER)} isPassword={true}/>
                    </div>
                    <div className="CM-Container">
                        <h1>Other Info</h1>
                        <CMDisplay labelText="Username" hasButton={true} buttonOnClickCallback={() => this.openModal(CMModalType.BASIC_CHANGES)} defaultValue={this.props.customerData.username}/>
                        <CMDisplay labelText="FirstName" defaultValue={this.state.defaultValues?.firstName}/>
                        <CMDisplay labelText="LastName" defaultValue={this.state.defaultValues?.lastName}/>
                        <CMDisplay labelText="Bio" defaultValue={this.state.defaultValues?.bio}/>
                        <CMDisplay labelText="Public Email" defaultValue={this.state.defaultValues?.exposedEmail}/>
                    </div>
                    <Modal isOpen={this.state.modalIsOpen} 
                    shouldCloseOnEsc={true} 
                    onRequestClose={() => this.closeModal()} 
                    ariaHideApp={false}
                    style={{content: 
                                {width: ((window.innerWidth * 60)/100), 
                                height: ((window.innerHeight * 80)/100), 
                                top: '50%', left: '50%', position: 'fixed', 
                                transform: 'translate(-50%, -50%)', 
                                background: '#DCE9FC', border: '2px solid red'}}}
                    >

                        {this.state.currentModalContent}

                    </Modal>  
                </div>
            </div>
        )
    }

}