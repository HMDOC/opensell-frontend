import { SmallAd } from "@components/shared/ad/small-ad";
import MuiMenuWithOptions from "@components/shared/mui-menu";
import { DisplayAdView } from "../../../../model/dto/DisplayAdView";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PanoramaIcon from '@mui/icons-material/Panorama';
import { deleteAd, getAdToModify } from "@services/ad/modification";
import AdCreatorDto from "@services/ad/modification/dto/AdCreatorDto";
import { useNavigate } from "react-router-dom";

interface DisplayAdProps extends DisplayAdView {
    onDelete(idAd: number): void;
    launchUpdate?(adCreator: AdCreatorDto): void;
}

export default function DisplayAd(props: DisplayAdProps) {
    const handleDelete = (): void => {
        deleteAd(props.idAd)
            .then(res => {
                if (res?.data) props.onDelete(props.idAd);
            });
    }

    const navigate = useNavigate();

    return (
        <SmallAd
            {...props}
            action={
                <MuiMenuWithOptions
                    menuIcon={<MoreHorizIcon />}
                    options={[
                        { label: "Modify", icon: <EditIcon />, action: async () => props.launchUpdate((await getAdToModify(props.idAd)).data) },
                        { label: "Preview", icon: <PanoramaIcon />, action: () => navigate(`/ad/${props.idAd}`) },
                        { label: "Delete", icon: <DeleteIcon />, action: () => handleDelete() }
                    ]}
                />
            }
        />
    );
}