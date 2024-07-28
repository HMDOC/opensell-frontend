import { ReactElement } from "react";
import { Divider, Stack, Typography } from "@mui/material";

export function AboutLine() {
    return (
        <Divider sx={{height: "2px", width: "290px", backgroundColor: "#3A3A3A"}} />
    );
}

export default function About(): ReactElement {
    return (
        <Stack className="main-background" alignItems="center" justifyContent="center">
            <title>About Opensell</title>

            <Stack alignItems="center">
                <Stack direction="row" alignItems="center" spacing={6} useFlexGap padding={1} marginLeft={30}>
                    <Typography fontSize={110}>About</Typography>
                    <AboutLine />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={6} useFlexGap padding={1}>
                    <AboutLine />
                    <Typography fontSize={110}>Us</Typography>
                </Stack>
            </Stack>

            <Typography variant="body1" textAlign="center" width={700}>
                Ce site web a été réalisé par<span style={{ fontWeight: "bold" }}> Quoc Dung</span>, <span style={{ fontWeight: "bold" }}>Achraf</span>, <span style={{ fontWeight: "bold" }}>Davide</span> et <span style={{ fontWeight: "bold" }}>Olivier </span>(les quatre mousquetaires) dans le cadre du cours de développement web au <span style={{ fontWeight: "bold" }}>Cégep Marie-Victorin</span>.<br />
                Temps total: 4 mois (du 24 janvier 2024 au 24 mai 2024)
            </Typography>
        </Stack>
    );
}