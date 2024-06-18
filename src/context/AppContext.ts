import { createContext } from "react";
import { ThemeOption } from "./Theme";

export const AppContext = createContext({
    theme: ThemeOption.BROWSER_DEFAULT,
    isDarkMode: (): boolean => true,
    changeTheme: (theme: ThemeOption) => {},
    customerDto: null,
    getCustomerInfo: async () => undefined,
    logout: () => {},
});