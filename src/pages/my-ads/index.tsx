import { AdBuyerView } from "@entities/dto/AdBuyerView";
import { DisplayAdView } from "@entities/dto/DisplayAdView";
import { AdCreator } from "@entities/dto/v2/AdCreator";
import AdCreationModal from "@pages/ad-creation/";
import { AdMapping } from "@pages/ad-view";
import { getCustomerAdPreview, getCustomerAds } from "@services/AdService";
import { createRandomKey } from "@services/RandomKeys";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import DisplayAd from "./components/display-ad";
import { useAppContext } from "@context/AppContext";
import { Container, IconButton, Stack, Typography, Button } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function MyAds() {
    const { customerDto } = useAppContext();

    const [displayAds, setDisplayAds] = useState<Array<DisplayAdView>>([]);
    const [isPreview, setIsPreview] = useState<boolean>(false);
    const [currentAdPreview, setCurrentAdPreview] = useState<Promise<AxiosResponse<AdBuyerView, any>>>();
    const [dialogState, setDialogState] = useState<{ open: boolean, adCreator?: AdCreator }>({ open: false });

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
        setDisplayAds(displayAds.filter(ad => ad.idAd !== idAd));
    }

    const getCurrentPromise = (idAd: number) => {
        setCurrentAdPreview(getCustomerAdPreview(idAd));
        setIsPreview(true);
    }

    const launchUpdate = (adCreator: AdCreator) => {
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
        <Container component={Stack} spacing={1}>
            <title>My ads</title>

            {isPreview ?
                (
                    <>
                        <Button onClick={() => setIsPreview(false)}>Go Back</Button>
                        <AdMapping request={currentAdPreview} />
                    </>
                ) : (
                    <>
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
                                            seeAdPreview={(idAd) => getCurrentPromise(idAd)}
                                            launchUpdate={launchUpdate}
                                        />))}
                                </Stack>
                            ) : (
                                <Typography variant="h4" textAlign="center">You have no ads</Typography>
                            )
                        }
                    </>
                )
            }
            <AdCreationModal onClose={onClose} {...dialogState} />
        </Container>
    );
}