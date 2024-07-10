import { createContext, useContext } from "react";
import { ThemeOption } from "./Theme";
import { CustomerDto } from "@entities/dto/CustomerDto";

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