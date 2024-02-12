import { Component, ReactElement, ReactNode } from "react";
import { useParams } from "react-router-dom";

export default function UserProfil(): ReactElement {
    const { link } = useParams();
    return(
        <>
            {link}
        </>
    );
}