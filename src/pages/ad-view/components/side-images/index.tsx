import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function SideImages(props: { images?: (string | undefined)[], openImageAction(index: number): void }) {
    return (
        <ImageList sx={{ width: 350 }} cols={1} rowHeight={204} variant="woven">
            {props.images?.map((img, index) => (
                <ImageListItem key={img}>
                    <img
                        onClick={() => props.openImageAction(index + 1)}
                        style={{ cursor: "pointer" }}
                        src={img}
                        alt={"Ad image."}
                        loading="lazy"
                    />
                </ImageListItem>
            )) ?? <></>}
        </ImageList>
    );
}