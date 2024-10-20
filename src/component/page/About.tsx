import { ReactElement } from "react";
import "../../css/component/page/About.css";
export default function About(): ReactElement {
    return (
        <div className="main-background">
            <title>About Opensell</title>
            <div className="about-div">
                <div className="about-text">
                    <div className="top-about">
                        <p style={{ paddingRight: "100px" }}>About</p>
                        <div className="top-about-line"></div>
                    </div>
                    <div className="about-middle">
                        <div className="about-line"></div>
                        <p>Us</p>
                    </div>
                </div>
                <p className="about-bottom">
                    This website was created by <span style={{ fontWeight: "bold" }}> Quoc Dung</span>, <span style={{ fontWeight: "bold" }}>Achraf</span>, <span style={{ fontWeight: "bold" }}>Davide</span> and <span style={{ fontWeight: "bold" }}>Olivier </span>  as part of the web development course at <span style={{ fontWeight: "bold" }}>Cégep Marie-Victorin</span>.<br />
                    Total time: 4 months (from January to May 2024)
                </p><br />
            </div>
        </div>
    );
}