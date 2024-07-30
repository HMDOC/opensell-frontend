import Logo from "@components/navbar/components/logo";
import { Stack, Typography } from "@mui/material";
import { ReactElement } from "react";
import LinkSection from "./link-section";
import linksSections from "./linksSections.json";

export default function Footer(): ReactElement {
    return (
        <Stack padding={5}>
            <Stack direction="row" alignItems="center" flexWrap="wrap" justifyContent="center" gap={8} padding={4}>
                <Stack>
                    <Logo isNotNavbar />
                    <Typography variant="h6">Everything you need, all in one place</Typography>
                </Stack>

                <Stack direction="row" gap={5} flexWrap="wrap">
                    <LinkSection title="Support" links={linksSections.support}></LinkSection>
                    <LinkSection title="Legal" links={linksSections.legal}></LinkSection>
                    <LinkSection title="Company" links={linksSections.compagny}></LinkSection>
                </Stack>
            </Stack>

            <Typography textAlign="center">&copy; 2024, Opensell.ca, Inc.</Typography>
        </Stack>
    );
}