import { Component, ReactElement, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MainMenu() : ReactElement {
    const naviguate = useNavigate();

        return(
            <>
                Main Menu
                <Link to="/login"><button>Login</button></Link>
                <Link to="/signup"><button>Register</button></Link>
                <Link to="/catalog"><button>Catalog</button></Link>
            </>
        );
    }