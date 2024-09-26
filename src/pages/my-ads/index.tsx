import { MARGIN_TOP_FOR_SECTION, useAppContext } from "@context/AppContext";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Container, IconButton, Stack, Typography } from "@mui/material";
import AdCreationModal from "@pages/ad-creation/";
import { createRandomKey } from "@utils/RandomKeys";
import { useEffect, useState } from "react";
import DisplayAd from "./components/display-ad";
import AdCreatorDto from "@services/ad/listings/dto/AdCreatorDto";
import { getCustomerAds } from "@services/ad/listings";
import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";

export default function MyAds() {
    const { customerDto } = useAppContext();

    const [displayAds, setDisplayAds] = useState<Array<AdPreviewDto>>([]);
    const [dialogState, setDialogState] = useState<{ open: boolean, adCreator?: AdCreatorDto }>({ open: false });

    // To only get data when something as been added or updated.
    const [isGetData, setIsGetData] = useState(true);

    useEffect(() => {
        if (customerDto?.customerId && !dialogState.open && isGetData) {
            getCustomerAds(customerDto?.customerId)
                .then(res => {
                    if (res?.data) {
                        setDisplayAds(res?.data);
                    }
                })

            setIsGetData(false);
            console.log("Get data!");
        }
    }, [dialogState]);

    const onDelete = (idAd: number) => {
        setDisplayAds(displayAds.filter(ad => ad.id !== idAd));
    }

    const launchUpdate = (adCreator: AdCreatorDto) => {
        setDialogState({ open: true, adCreator });
    }

    const launchCreate = () => {
        setDialogState({ open: true });
    }

    const onClose = (isChange?: boolean) => {
        if (isChange) {
            setIsGetData(true);
        }

        setDialogState({ ...dialogState, open: false });
    }

    return (
        <Container marginTop={MARGIN_TOP_FOR_SECTION} component={Stack} spacing={1}>
            <title>My ads</title>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" fontWeight="bold">My ads</Typography>

                <IconButton onClick={launchCreate} color="primary">
                    <AddCircleIcon sx={{ fontSize: "55px" }} />
                </IconButton>
            </Stack>

            {displayAds?.length > 0 ?
                (
                    <Stack spacing={2} direction="row" flexWrap="wrap" justifyContent="center" useFlexGap>
                        {displayAds?.map(value => (
                            <DisplayAd
                                key={createRandomKey()}
                                {...value}
                                onDelete={(idAd) => onDelete(idAd)}
                                launchUpdate={launchUpdate}
                            />))}
                    </Stack>
                ) : (
                    <Typography variant="h4" textAlign="center">You have no ads</Typography>
                )
            }

            <AdCreationModal onClose={onClose} {...dialogState} />
        </Container>
    );
}