import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import getUserInfos from "@services/TokenService";
import { createContext, ReactNode, useContext, useState } from "react";
import { CustomerDto } from "../services/customer/auth/CustomerDto";
import { Theme, ThemeOption } from "./Theme";

export const MARGIN_TOP_FOR_SECTION = 10;
export const DESKTOP_VIEW = { xs: 'none', md: 'flex' };
export const MOBILE_VIEW = { xs: 'flex', md: 'none' };

type AppContextProps = {
	theme: ThemeOption;
	isDarkMode(): boolean;
	changeTheme(theme: ThemeOption): void;
	customerDto?: CustomerDto;
	getCustomerInfo(): Promise<any>;
	logout(): void;
};

export const AppContext = createContext<AppContextProps>({} as any);

export const useAppContext = () => useContext(AppContext);

export function AppContextProvider(props: { children: ReactNode }) {
	const [customerDto, setCustomerDto] = useState<CustomerDto | undefined>(undefined);
	const [theme, setTheme] = useState<ThemeOption>(Theme.getStorageTheme());

	const getCustomerInfo = async (): Promise<any> => {
		const data = (await getUserInfos("token"))?.data;
		if (customerDto !== data) setCustomerDto(data);
		return data;
	}

	const logout = () => {
		if (customerDto) setCustomerDto(undefined);
	}

	const changeTheme = (theme: ThemeOption) => {
		setTheme(theme);
		Theme.setTheme(theme);
	}

	const muiTheme = createTheme({
		palette: {
			mode: Theme.isDarkMode(theme) ? "dark" : "light",
			primary: {
				main: "#778da9"
			}
		},
		components: {
			MuiButton: {
				defaultProps: {
					variant: "contained",
					sx: {
						fontSize: "16px",
						textTransform: "none",
					}
				}
			},
			MuiTextField: {
				defaultProps: {
					variant: "outlined"
				}
			}
		}
	});

	return (
		<AppContext.Provider value={{ theme, changeTheme, customerDto, getCustomerInfo, isDarkMode: () => Theme.isDarkMode(theme), logout }}>
			<ThemeProvider theme={muiTheme}>
				<CssBaseline />
				{props.children}
			</ThemeProvider>
		</AppContext.Provider>
	)
}