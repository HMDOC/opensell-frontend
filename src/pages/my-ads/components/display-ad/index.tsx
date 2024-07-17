import { SmallAd } from "@components/shared/ad/small-ad";
import MuiMenuWithOptions from "@components/shared/mui-menu";
import { DisplayAdView } from "@entities/dto/DisplayAdView";
import { AdCreator } from "@entities/dto/v2/AdCreator";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PanoramaIcon from '@mui/icons-material/Panorama';
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
        <SmallAd
            {...props}
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
    );
}