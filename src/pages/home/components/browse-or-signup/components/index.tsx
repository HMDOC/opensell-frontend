import { Button } from "@mui/material";
import { Link } from "react-router-dom";

type ActionButton = {
    label: string;
    pathname: string;
};

export default function ActionButton(props: ActionButton) {
    return (
        <Link to={props.pathname}>
            <Button
                style={{
                    backgroundColor: "#5F738B",
                    color: "white",
                    width: "110px",
                    fontSize: "18px",
                    borderRadius: "10px"
                }}>
                {props.label}
            </Button>
        </Link>
    );
}