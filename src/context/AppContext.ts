import { createContext, useContext } from "react";
import { ThemeOption } from "./Theme";
import { TextFieldVariants } from "@mui/material";
import { CustomerDto } from "@entities/dto/CustomerDto";

export const MUI_INPUT_VARIANT: TextFieldVariants = "outlined";

function getCustomerDto(): CustomerDto | undefined {
    return undefined;
}

export const AppContext = createContext({
    theme: ThemeOption.BROWSER_DEFAULT,
    isDarkMode: (): boolean => true,
    changeTheme: (theme: ThemeOption) => {},
    customerDto: getCustomerDto(),
    getCustomerInfo: async () => undefined,
    logout: () => {},
});

export const useAppContext = () => useContext(AppContext);