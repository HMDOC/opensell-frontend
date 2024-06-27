import { createContext } from "react";
import { ThemeOption } from "./Theme";
import { TextFieldVariants } from "@mui/material";

export const MUI_INPUT_VARIANT: TextFieldVariants = "outlined";

export const AppContext = createContext({
    theme: ThemeOption.BROWSER_DEFAULT,
    isDarkMode: (): boolean => true,
    changeTheme: (theme: ThemeOption) => {},
    customerDto: null,
    getCustomerInfo: async () => undefined,
    logout: () => {},
});