import { MARGIN_TOP_FOR_SECTION, useAppContext } from '@context/AppContext';
import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent, CardHeader, Container, Divider, Stack, Typography, useTheme } from '@mui/material';
import AdPreviewDto from '@services/ad/catalog/dto/AdPreviewDto';
import { ReactElement, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProfilIcon, { AVATAR_SIZE } from "../../components/shared/ProfilIcon";
import ProfileDto from "../../services/customer/ProfileDto";
import AdPreview from "../catalog/components/ad-preview";
import { getCustomerProfileDto } from '@services/customer';
import { getCustomerIconUrl } from '@services/file';

export default function UserProfil(): ReactElement {
    const { username } = useParams();
    const [profileDto, setCustomerProfileDto] = useState<ProfileDto>();
    const { customerDto } = useAppContext();
    const theme = useTheme();
    const isMyProfil = customerDto?.username == username;

    useEffect(() => {
        console.log(username);
        getCustomerProfileDto(username).then(res => {
            setCustomerProfileDto(res?.data)
        });
    }, [username]);

    return (
        <Container>
            <title>{profileDto?.username}</title>

            <Card sx={{marginTop: MARGIN_TOP_FOR_SECTION}}>
                <CardHeader
                    action={
                        isMyProfil ? <Link to="/u/setting" style={{ color: theme.palette.text.primary }}><EditIcon /></Link> : <></>
                    }
                />

                <CardContent component={Stack} spacing={2}>
                    <Stack justifyContent="center" alignItems="center" direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        <ProfilIcon avatarSize={AVATAR_SIZE} src={getCustomerIconUrl(profileDto?.iconPath)} username={profileDto?.username} />

                        <Stack spacing={0.8} sx={{ maxWidth: "600px" }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography variant="h4">{profileDto?.username}</Typography>
                                <span style={{ color: "grey", fontSize: "11px" }}>Since {new Date(profileDto?.joinedDate!).getFullYear()}</span>
                            </Stack>

                            <Typography variant="body1">{profileDto?.bio}</Typography>
                        </Stack>
                    </Stack>
                    <Divider />

                    {(profileDto?.ads?.length! > 0) ?
                        (
                            <Stack flexWrap="wrap" direction="row" spacing={2} useFlexGap>
                                {profileDto?.ads?.map((data: AdPreviewDto, i: number) => (
                                    <AdPreview
                                        key={`ad-preview-${i}`}
                                        id={data?.id}
                                        {...data}
                                    />
                                ))}
                            </Stack>
                        )
                        : <Typography variant="h6">No ads posted, yet</Typography>
                    }
                </CardContent>
            </Card>
        </Container>
    );
}