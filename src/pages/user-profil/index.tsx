import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import { ReactElement, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProfilIcon, { AVATAR_SIZE } from "../../components/shared/ProfilIcon";
import CustomerProfil from "../../entities/dto/CustomerProfil";
import { getCustomerProfil } from "../../services/CustomerInfo";
import AdPreview from "../catalog/components/ad-preview";
import EmailIcon from '@mui/icons-material/Email';
import { Card, CardContent, CardHeader, Container, Divider, Stack, Typography } from '@mui/material';
import { IconLabel } from '@components/shared/IconLabel';

export default function UserProfil(props: { loggedUserLink?: string, isMyProfil?: boolean }): ReactElement {
    const { link } = useParams();
    const [customerProfil, setCustomerProfil] = useState<CustomerProfil>();

    useEffect(() => {
        getCustomerProfil(props.isMyProfil ? props.loggedUserLink : link).then(res => {
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

                            {customerProfil?.customerInfo?.exposedEmail ?
                                (
                                    <IconLabel
                                        title={customerProfil?.customerInfo?.exposedEmail}
                                        icon={<EmailIcon />}
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
                                {customerProfil?.ads?.map((data: AdSearchPreview, i: number) => (
                                    <AdPreview
                                        key={`ad-preview-${i}`}
                                        link={data?.adLink}
                                        price={data?.adPrice}
                                        shape={data?.adShape}
                                        title={data?.adTitle}
                                        isSold={data?.isAdSold}
                                        firstImagePath={data?.adFirstImagePath}
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