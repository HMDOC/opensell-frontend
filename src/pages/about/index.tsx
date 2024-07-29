import { Card, Container, Divider, Stack, Typography, useTheme } from "@mui/material";
import { ReactElement } from "react";

export function AboutLine() {
    const theme = useTheme();

    return (
        <Divider sx={{ height: "2px", width: "290px", backgroundColor: theme.palette.text.primary }} />
    );
}

export default function About(): ReactElement {
    return (
        <Container>
            <title>About Opensell</title>

            <Stack component={Card} height="700px" alignItems="center" justifyContent="center">
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
        </Container >
    );
}