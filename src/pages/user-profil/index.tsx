import { useAppContext } from '@context/AppContext';
import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent, CardHeader, Container, Divider, Stack, Typography } from '@mui/material';
import AdPreviewDto from '@services/ad/catalog/dto/AdPreviewDto';
import { ReactElement, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProfilIcon, { AVATAR_SIZE } from "../../components/shared/ProfilIcon";
import ProfileDto from "../../model/dto/ProfileDto";
import AdPreview from "../catalog/components/ad-preview";
import { getCustomerProfileDto } from '@services/customer';

export default function UserProfil(props: { isMyProfil?: boolean }): ReactElement {
    const { username } = useParams();
    const [profileDto, setCustomerProfileDto] = useState<ProfileDto>();
    const { customerDto } = useAppContext();

    useEffect(() => {
        console.log(username);
        getCustomerProfileDto(props.isMyProfil ? customerDto?.username : username).then(res => {
            setCustomerProfileDto(res?.data)
        });
    }, []);

    return (
        <Container>
            <title>{profileDto?.username}</title>

            <Card>
                <CardHeader
                    action={
                        props.isMyProfil ? <Link to="/u/setting"><EditIcon /></Link> : <></>
                    }
                />

                <CardContent component={Stack} spacing={2}>
                    <Stack justifyContent="center" alignItems="center" direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        <ProfilIcon avatarSize={AVATAR_SIZE} src={profileDto?.iconPath} username={profileDto?.username} />

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