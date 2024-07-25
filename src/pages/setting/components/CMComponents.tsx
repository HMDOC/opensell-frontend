import { CustomerDto } from "@model/dto/CustomerDto";
import { Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface CMState {
    modalIsOpen: boolean;
    currentModalContent: ReactNode;
    currentModalTitle: string;
}

export interface CMProperties {
    customerData?: CustomerDto;
    refreshCallback(): void;
}

export interface CMDisplayProperties {
    labelText: string;
    defaultValue?: string;
    hasButton?: boolean;
    buttonOnClickCallback?(): void;
}

export function CMEditButton(props: { onClick: any, label: string }) {
    return (
        <Button onClick={props.onClick}>{props.label}</Button>
    );
}

export function CMContainer(props: { children: any, title: string, editButton?: any }) {
    return (
        <TableContainer component={Card} sx={{ borderRadius: "10px" }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant="h5" fontWeight="bold">{props.title}</Typography>
                        </TableCell>

                        <TableCell></TableCell>

                        <TableCell align="right">
                            {props.editButton ?? <></>}
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {props.children}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export function CMDisplay(props: CMDisplayProperties) {
    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>
                <Typography variant="subtitle1">{props.labelText}</Typography>
            </TableCell>

            <TableCell align="left">
                <Typography variant="subtitle1">{props.defaultValue ?? <span style={{ color: 'brown' }}>{"<Empty>"}</span>}</Typography>
            </TableCell>

            <TableCell align="right">
                {props.hasButton ?
                    (
                        <CMEditButton label="Edit" onClick={() => props.buttonOnClickCallback?.()} />
                    ) : (<></>)
                }
            </TableCell>
        </TableRow>
    )
}
