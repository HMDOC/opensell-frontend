import { Component, ReactNode } from "react";
import { CMModalType } from "@services/customer/setting";
import { CMContainer, CMDisplay, CMEditButton, CMProperties, CMState } from "@services/customerModification/CMComponents";
import "./style.css"
import { CMBasicModificationsForm, CMIconForm, CMPasswordForm, CMemailForm, CMPhoneNumberForm } from "@services/customerModification/CMForm";
import ProfilIcon from "@components/shared/ProfilIcon";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TableCell, TableRow, Typography } from "@mui/material";

/**
 *
 * @author Olivier Mansuy
 * @Note 
 * https://www.w3schools.com/typescript/typescript_casting.php
 * https://javascript.plainenglish.io/promise-based-prop-in-react-78a77440f4fc
 * https://stackoverflow.com/questions/50094331/react-app-componentdidmount-not-getting-props-from-parent
 * https://blog.logrocket.com/types-vs-interfaces-typescript/
 *
 */
export default class CustomerModification extends Component<CMProperties, CMState> {
    public state = {
        modalIsOpen: false,
        currentModalContent: null,
        currentModalTitle: ""
    }

    public openModal(type: CMModalType): void {
        if (type === CMModalType.BASIC_CHANGES) this.setState({ currentModalTitle: "other informations", currentModalContent: <CMBasicModificationsForm defaultValues={this.props.customerData} closeModalCallback={() => this.closeModal()} /> });
        else if (type === CMModalType.PERSONNAL_EMAIL) this.setState({ currentModalTitle: "personnal email", currentModalContent: <CMemailForm onClose={() => this.closeModal()} /> });
        else if (type === CMModalType.PASSWORD) this.setState({ currentModalTitle: "password", currentModalContent: <CMPasswordForm defaultValues={this.props.customerData} closeModalCallback={() => this.closeModal()} /> });
        else if (type === CMModalType.PHONE_NUMBER) this.setState({ currentModalTitle: "phone number", currentModalContent: <CMPhoneNumberForm defaultValues={this.props.customerData} closeModalCallback={() => this.closeModal()} /> });
        else if (type === CMModalType.ICON) this.setState({ currentModalTitle: "icon", currentModalContent: <CMIconForm defaultValues={this.props.customerData} closeModalCallback={() => this.closeModal()} /> });
        this.setState({ modalIsOpen: true });
    }

    public closeModal(): void {
        this.setState({ modalIsOpen: false });
        this.props.refreshCallback();
    }

    render(): ReactNode {
        return (
            <Container>
                <title>Settings</title>

                <Stack spacing={2} useFlexGap>
                    <CMContainer title="Sensitive Information">
                        <CMDisplay labelText="Email" hasButton={true} buttonOnClickCallback={() => this.openModal(CMModalType.PERSONNAL_EMAIL)} defaultValue={this.props.customerData.email} />
                        <CMDisplay labelText="Password" hasButton={true} buttonOnClickCallback={() => this.openModal(CMModalType.PASSWORD)} isPassword={true} />
                        <CMDisplay labelText="Phone Number" hasButton={true} buttonOnClickCallback={() => this.openModal(CMModalType.PHONE_NUMBER)} defaultValue={this.props.customerData.customerInfo?.phoneNumber} />
                    </CMContainer>

                    <CMContainer title="Other Information" editButton={<CMEditButton label="Edit" onClick={() => this.openModal(CMModalType.BASIC_CHANGES)} />} >
                        <CMDisplay labelText="Username" defaultValue={this.props.customerData.username} />
                        <CMDisplay labelText="FirstName" defaultValue={this.props.customerData.customerInfo?.firstName} />
                        <CMDisplay labelText="LastName" defaultValue={this.props.customerData.customerInfo?.lastName} />
                        <CMDisplay labelText="Bio" defaultValue={this.props.customerData.customerInfo?.bio} />
                    </CMContainer>

                    <CMContainer title="Profile icon">
                        <TableRow sx={{ border: "none" }} className="change-button">
                            <TableCell>
                                <ProfilIcon src={this.props.customerData?.customerInfo?.iconPath} username={this.props.customerData?.username} />
                            </TableCell>

                            <TableCell />
                            <TableCell>
                                <CMEditButton onClick={() => this.openModal(CMModalType.ICON)} label="Edit" />
                            </TableCell>
                        </TableRow>
                    </CMContainer>
                </Stack>

                <Dialog open={this.state.modalIsOpen} onClose={() => this.closeModal()} fullWidth>
                    <DialogTitle variant="h5">
                        Edit {this.state.currentModalTitle}
                    </DialogTitle>
                    <Divider />

                    <DialogContent>
                        {this.state.currentModalContent}
                    </DialogContent>
                    <Divider />

                    <DialogActions>
                        <Button onClick={() => this.closeModal()}>Cancel</Button>
                        <Button type="submit" form="setting-form">Save</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        )
    }

}