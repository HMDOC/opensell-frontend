import { Card, Typography } from "@mui/material";

type StatisticCardProps = {
    value: string;
    text: string;
};

export default function StatisticCard(props: StatisticCardProps) {
    return (
        <Card
            sx={{
                bgcolor: "#778DA9",
                color: "white",
                width: "250px",
                height: "175px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign : "center",
                borderRadius : "30px"
            }}>
            <Typography variant="h3" fontWeight="bold">{props.value}</Typography>
            <Typography variant="h5">{props.text}</Typography>
        </Card>
    );
}