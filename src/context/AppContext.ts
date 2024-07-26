import { createContext, useContext } from "react";
import { ThemeOption } from "./Theme";
import { CustomerDto } from "../services/customer/auth/CustomerDto";

export const DESKTOP_VIEW = { xs: 'none', md: 'flex' };
export const MOBILE_VIEW = { xs: 'flex', md: 'none' };

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