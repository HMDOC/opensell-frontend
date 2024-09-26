import { DESKTOP_VIEW, MARGIN_TOP_FOR_SECTION } from "@context/AppContext";
import { Box, Stack, Button, Card, Container, CardContent } from "@mui/material";
import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";

export default class NotFound extends Component<{}> {
    public render(): ReactNode {
        return (
            <Container component={Stack} margin={MARGIN_TOP_FOR_SECTION}>
                <title>Not Found</title>

                <Card>
                    <Stack component={CardContent} padding={5} direction="row" justifyContent="center">
                        <Stack justifyContent="center">
                            <h1 className="mb-4"><b>404 Not-Found</b></h1>
                            <p className="mb-4" style={{ marginRight: "2em" }} >
                                This page does not exist.
                                Make sure the link you're using doesn't have a typo, or any other plausible mistake.
                            </p>
                            <Link to="/">
                                <Button sx={{ width: "100px" }}>Home</Button>
                            </Link>
                        </Stack>

                        <Box sx={{ display: DESKTOP_VIEW }}>
                            <img width="400px" height="600px" src="/img/auth-deco.jpg" alt="image-decoration" />
                        </Box>
                    </Stack>
                </Card>
            </Container>
        );
    }
}