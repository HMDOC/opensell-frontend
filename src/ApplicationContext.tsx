import { createContext } from "react";
import { CustomerDto } from "./entities/dto/CustomerDto";

export const ApplicationContext = createContext({
    isDarkMode: false,
    setIsDarkMode: (isDarkMode: boolean) => {},
    customerDto: null,
    getCustomerInfo: async () => undefined
});