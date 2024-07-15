import AdPricePart from "@components/shared/ad/price-part";
import MuiMenuWithOptions from "@components/shared/mui-menu";
import { getVisibilityIcon } from "@components/shared/SharedAdPart";
import { DisplayAdView } from "@entities/dto/DisplayAdView";
import { AdCreator } from "@entities/dto/v2/AdCreator";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PanoramaIcon from '@mui/icons-material/Panorama';
import { Card, CardHeader, CardMedia } from "@mui/material";
import { deleteAd, getAdToModify } from "@services/AdService";

interface DisplayAdProps extends DisplayAdView {
    onDelete(idAd: number): void;
    seeAdPreview(idAd: number): void;
    launchUpdate?(adCreator: AdCreator): void;
}

export default function DisplayAd(props: DisplayAdProps) {
    const handleDelete = (): void => {
        deleteAd(props.idAd)
            .then(res => {
                if (res?.data) props.onDelete(props.idAd);
            });
    }

    return (
        <Card>
            <CardMedia component="img" image={props.firstImage} width="220px" height="150px" />

            <CardHeader
                title={<h2>{getVisibilityIcon(props.visibility)}{props.title}</h2>}
                subheader={
                    <AdPricePart price={props.price} isSold={props.isSold} />
                }
                action={
                    <MuiMenuWithOptions
                        menuIcon={<MoreHorizIcon />}
                        options={[
                            { label: "Modify", icon: <EditIcon />, action: async () => props.launchUpdate((await getAdToModify(props.link)).data) },
                            { label: "Preview", icon: <PanoramaIcon />, action: () => props.seeAdPreview(props.idAd) },
                            { label: "Delete", icon: <DeleteIcon />, action: () => handleDelete() }
                        ]}
                    />
                }
            />
        </Card>
    );
}