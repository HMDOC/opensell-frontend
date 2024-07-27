import ProfilIcon from "@components/shared/ProfilIcon";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TableCell, TableRow } from "@mui/material";
import { CMContainer, CMDisplay, CMEditButton } from "@pages/setting/components/CMComponents";
import { CMBasicModificationsForm, CMEmailForm, CMIconForm, CMPasswordForm } from "@pages/setting/components/CMForm";
import { CustomerDto } from "@services/customer/auth/CustomerDto";
import { CMModalType } from "@services/customer/setting/edit";
import { useState } from "react";
import SettingTheme from "./components/theme";

export interface SettingProps {
    customerData?: CustomerDto;
    refreshCallback(): void;
}


/**
 *
 * @author Olivier Mansuy
 * @modifiedBy Achraf
 * @Note 
 * https://www.w3schools.com/typescript/typescript_casting.php
 * https://javascript.plainenglish.io/promise-based-prop-in-react-78a77440f4fc
 * https://stackoverflow.com/questions/50094331/react-app-componentdidmount-not-getting-props-from-parent
 * https://blog.logrocket.com/types-vs-interfaces-typescript/
 *
 */
export default function Setting(props: SettingProps) {
    const [modalState, setModalState] = useState({
        modalIsOpen: false,
        currentModalContent: <></>,
        currentModalTitle: ""
    });

    const openModal = (type: CMModalType): void => {
        if (type === CMModalType.BASIC_CHANGES) setModalState({ modalIsOpen: true, currentModalTitle: "other informations", currentModalContent: <CMBasicModificationsForm defaultValues={props.customerData} closeModalCallback={() => closeModal()} /> });
        else if (type === CMModalType.EMAIL) setModalState({ modalIsOpen: true, currentModalTitle: "personnal email", currentModalContent: <CMEmailForm onClose={() => closeModal()} /> });
        else if (type === CMModalType.PASSWORD) setModalState({ modalIsOpen: true, currentModalTitle: "password", currentModalContent: <CMPasswordForm defaultValues={props.customerData} closeModalCallback={() => closeModal()} /> });
        else if (type === CMModalType.ICON) setModalState({ modalIsOpen: true, currentModalTitle: "icon", currentModalContent: <CMIconForm defaultValues={props.customerData} closeModalCallback={() => closeModal()} /> });
    }

    const closeModal = (): void => {
        setModalState({ ...modalState, modalIsOpen: false });
        props.refreshCallback();
    }

    return (
        <Container>
            <title>Settings</title>

            <Stack spacing={2} useFlexGap>
                <CMContainer title="Sensitive Information">
                    <CMDisplay labelText="Email" hasButton={true} buttonOnClickCallback={() => openModal(CMModalType.EMAIL)} defaultValue={props?.customerData?.email} />
                    <CMDisplay labelText="Password" hasButton={true} buttonOnClickCallback={() => openModal(CMModalType.PASSWORD)} defaultValue="***************" />
                </CMContainer>

                <CMContainer title="Other Information" editButton={<CMEditButton label="Edit" onClick={() => openModal(CMModalType.BASIC_CHANGES)} />} >
                    <CMDisplay labelText="Username" defaultValue={props.customerData?.username} />
                    <CMDisplay labelText="FirstName" defaultValue={props.customerData?.firstName} />
                    <CMDisplay labelText="LastName" defaultValue={props.customerData?.lastName} />
                    <CMDisplay labelText="Bio" defaultValue={props.customerData?.bio} />
                </CMContainer>

                <CMContainer title="Profile icon">
                    <TableRow sx={{ border: "none" }}>
                        <TableCell>
                            <ProfilIcon src={props.customerData?.iconPath} username={props.customerData?.username} />
                        </TableCell>

                        <TableCell />
                        <TableCell>
                            <CMEditButton onClick={() => openModal(CMModalType.ICON)} label="Edit" />
                        </TableCell>
                    </TableRow>
                </CMContainer>

                <SettingTheme />

            </Stack>

            <Dialog open={modalState.modalIsOpen} onClose={() => closeModal()} fullWidth>
                <DialogTitle variant="h5">
                    Edit {modalState.currentModalTitle}
                </DialogTitle>
                <Divider />

                <DialogContent>
                    {modalState.currentModalContent}
                </DialogContent>
                <Divider />

                <DialogActions>
                    <Button onClick={() => closeModal()}>Cancel</Button>
                    <Button type="submit" form="setting-form">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}