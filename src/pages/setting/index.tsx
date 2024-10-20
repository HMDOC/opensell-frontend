import { AVATAR_SIZE } from "@components/shared/ProfilIcon";
import { MARGIN_TOP_FOR_SECTION, useAppContext } from "@context/AppContext";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { CMContainer, CMDisplay, CMEditButton } from "@pages/setting/components/CMComponents";
import { CMBasicModificationsForm, CMEmailForm, CMPasswordForm } from "@pages/setting/components/CMForm";
import { CustomerDto } from "@services/customer/auth/CustomerDto";
import { changeIcon, CMModalType } from "@services/customer/setting/edit";
import { useState } from "react";
import { SingleImageInput } from "./components/profile-icon";
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
    const { customerDto } = useAppContext();
    const [modalState, setModalState] = useState({
        modalIsOpen: false,
        currentModalContent: <></>,
        currentModalTitle: ""
    });

    const openModal = (type: CMModalType): void => {
        if (type === CMModalType.BASIC_CHANGES) setModalState({ modalIsOpen: true, currentModalTitle: "other informations", currentModalContent: <CMBasicModificationsForm defaultValues={props.customerData} closeModalCallback={() => closeModal()} /> });
        else if (type === CMModalType.EMAIL) setModalState({ modalIsOpen: true, currentModalTitle: "personnal email", currentModalContent: <CMEmailForm onClose={() => closeModal()} /> });
        else if (type === CMModalType.PASSWORD) setModalState({ modalIsOpen: true, currentModalTitle: "password", currentModalContent: <CMPasswordForm defaultValues={props.customerData} closeModalCallback={() => closeModal()} /> });
    }

    const closeModal = (): void => {
        setModalState({ ...modalState, modalIsOpen: false });
        props.refreshCallback();
    }

    return (
        <Container>
            <title>Settings</title>

            <Stack marginTop={MARGIN_TOP_FOR_SECTION} spacing={2} useFlexGap>
                <CMContainer title="Sensitive information">
                    <CMDisplay labelText="Email" hasButton={true} buttonOnClickCallback={() => openModal(CMModalType.EMAIL)} defaultValue={props?.customerData?.email} />
                    <CMDisplay labelText="Password" hasButton={true} buttonOnClickCallback={() => openModal(CMModalType.PASSWORD)} defaultValue="***************" />
                </CMContainer>

                <CMContainer title="Other information" editButton={<CMEditButton label="Edit" onClick={() => openModal(CMModalType.BASIC_CHANGES)} />} >
                    <CMDisplay labelText="Username" defaultValue={props.customerData?.username} />
                    <CMDisplay labelText="First name" defaultValue={props.customerData?.firstName} />
                    <CMDisplay labelText="Last name" defaultValue={props.customerData?.lastName} />
                    <CMDisplay labelText="Bio" defaultValue={props.customerData?.bio} />
                </CMContainer>

                <CMContainer title="Profile">
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                            <Typography variant="h6">Profile icon</Typography>

                            <Typography variant="subtitle2">The icon visible to everyone.</Typography>
                        </TableCell>

                        <TableCell />

                        <TableCell sx={{ float: "right" }}>
                            <SingleImageInput avatarSize={AVATAR_SIZE} id={customerDto?.customerId!} saveQuery={(id, file) => { changeIcon(id!, file); props.refreshCallback(); }} avatarText={customerDto?.username?.at(0)} path={customerDto?.iconPath} />
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