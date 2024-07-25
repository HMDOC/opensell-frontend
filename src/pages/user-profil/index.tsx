import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import { ReactElement, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProfilIcon, { AVATAR_SIZE } from "../../components/shared/ProfilIcon";
import CustomerProfil from "../../model/dto/CustomerProfil";
import { getCustomerProfil } from "../../services/CustomerInfo";
import AdPreview from "../catalog/components/ad-preview";
import EmailIcon from '@mui/icons-material/Email';
import { Card, CardContent, CardHeader, Container, Divider, Stack, Typography } from '@mui/material';
import { IconLabel } from '@components/shared/IconLabel';
import { useAppContext } from '@context/AppContext';
import AdPreviewDto from '@services/ad/catalog/dto/AdPreviewDto';

export default function UserProfil(props: { isMyProfil?: boolean }): ReactElement {
    const { username } = useParams();
    const [customerProfil, setCustomerProfil] = useState<CustomerProfil>();
    const { customerDto } = useAppContext();

    useEffect(() => {
        console.log(username);
        getCustomerProfil(props.isMyProfil ? customerDto.username : username).then(res => {
            setCustomerProfil(res?.data)
        });
    }, []);

    return (
        <Container>
            <title>{customerProfil?.username}</title>

            <Card>
                <CardHeader
                    action={
                        props.isMyProfil ? <Link to="/u/setting"><EditIcon /></Link> : <></>
                    }
                />

                <CardContent component={Stack} spacing={2}>
                    <Stack justifyContent="center" alignItems="center" direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        <ProfilIcon avatarSize={AVATAR_SIZE} src={customerProfil?.customerInfo?.iconPath} username={customerProfil?.username} />

                        <Stack spacing={0.8} sx={{ maxWidth: "600px" }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography variant="h4">{customerProfil?.username}</Typography>
                                <span style={{ color: "grey", fontSize: "11px" }}>Since {new Date(customerProfil?.joinedDate).getFullYear()}</span>
                            </Stack>

                            {customerProfil?.customerInfo?.phoneNumber ?
                                (
                                    <IconLabel
                                        title={customerProfil?.customerInfo?.phoneNumber}
                                        icon={<PhoneIcon />}
                                    />
                                ) : (
                                    <></>
                                )
                            }

                            <Typography variant="body1">{customerProfil?.customerInfo?.bio}</Typography>
                        </Stack>
                    </Stack>
                    <Divider />

                    {(customerProfil?.ads?.length > 0) ?
                        (
                            <Stack flexWrap="wrap" direction="row" spacing={2} useFlexGap>
                                {customerProfil?.ads?.map((data: AdPreviewDto, i: number) => (
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