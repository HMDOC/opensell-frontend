import { Stack } from "@mui/material";
import { ReactElement } from "react";
import FirstSection from "./components/first-section";
import PopularClient from "./components/popular-client";
import Statistics from "./components/statistics";
import WhyOpensell from "./components/why-opensell";
import BrowseOrSignup from "./components/browse-or-signup";
import Footer from "./components/footer";

export default function Home(): ReactElement {
    return (
        <Stack>
            <FirstSection />
            <PopularClient />
            <Statistics />
            <WhyOpensell />
            <BrowseOrSignup />
            <Footer />
        </Stack>
    );
}