interface FrontImageProps {
    imagesLength?: number;
    action(): void;
    path?: string;
    isMobile?: boolean;
}

export default function FrontImage(props: FrontImageProps) {
    return (
        <img
            style={props.isMobile ? undefined : { cursor: "pointer", width: props.imagesLength > 1 ? "70%" : "100%" }}
            onClick={props.action}
            className="imgFit"
            src={props.path}
        />
    );
}