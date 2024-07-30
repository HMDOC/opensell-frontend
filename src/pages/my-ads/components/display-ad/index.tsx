import { SmallAd } from "@components/shared/ad/small-ad";
import MuiMenuWithOptions from "@components/shared/mui-menu";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PanoramaIcon from '@mui/icons-material/Panorama';
import { deleteAd, getAdToModify } from "@services/ad/listings";
import AdCreatorDto from "@services/ad/listings/dto/AdCreatorDto";
import { useNavigate } from "react-router-dom";
import AdPreviewDto from "@services/ad/catalog/dto/AdPreviewDto";

interface DisplayAdProps extends AdPreviewDto {
    onDelete(idAd: number): void;
    launchUpdate?(adCreator: AdCreatorDto): void;
}

export default function DisplayAd(props: DisplayAdProps) {
    const handleDelete = (): void => {
        deleteAd(props.id!)
            .then(res => {
                if (res?.data) props.onDelete(props.id!);
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
                        { label: "Modify", icon: <EditIcon />, action: async () => props.launchUpdate?.((await getAdToModify(props.id!)).data) },
                        { label: "Preview", icon: <PanoramaIcon />, action: () => navigate(`/ad/${props.id}`) },
                        { label: "Delete", icon: <DeleteIcon />, action: () => handleDelete() }
                    ]}
                />
            }
        />
    );
}