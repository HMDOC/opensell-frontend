import { createContext } from "react";

export enum ThemeOption {
    BROWSER_DEFAULT,
    DARK,
    LIGHT
}

export class Theme {
    private constructor() {}

    private static isBrowserThemeDark() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    public static isDarkMode(theme: ThemeOption): boolean {
        switch(theme) {
            case ThemeOption.BROWSER_DEFAULT: return this.isBrowserThemeDark();
            case ThemeOption.DARK: return true;
            case ThemeOption.LIGHT: return false;
        }
    }

    private static setHtmlTheme(theme: ThemeOption) {
        // This is to put the element into <html />
		document.documentElement.setAttribute("is-dark-mode", this.isDarkMode(theme)?.toString());
    }

    public static setTheme(theme: ThemeOption) {
        localStorage.setItem("isDarkMode", theme.toString());
        this.setHtmlTheme(theme);
    }
    
    public static getStorageTheme(): ThemeOption {
        let storage: string = localStorage.getItem("isDarkMode");
        let theme: ThemeOption = ThemeOption.BROWSER_DEFAULT;

        // Added this boiler plate code because a lot of bugs where faced.
        if(storage != null) {
            if(storage.toString() == ThemeOption.DARK.toString()) theme = ThemeOption.DARK;
            else if(storage.toString() == ThemeOption.LIGHT.toString()) theme = ThemeOption.LIGHT;
        }

        if(theme == ThemeOption.BROWSER_DEFAULT ) {
            this.setTheme(theme);
            return theme;
        }
        
        this.setHtmlTheme(theme);
        return theme;
    }
}

export const ApplicationContext = createContext({
    theme: ThemeOption.BROWSER_DEFAULT,
    isDarkMode: (): boolean => true,
    changeTheme: (theme: ThemeOption) => {},
    customerDto: null,
    getCustomerInfo: async () => undefined
});