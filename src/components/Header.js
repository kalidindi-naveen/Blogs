import { useContext } from "react";
import { ThemeContext } from "../App";
import { LogoIcon, MoonIcon, SunIcon } from "./assets/icons";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { isDark, setIsDark } = useContext(ThemeContext);
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="container">
                <div className="logo-wrapper">
                    <div
                        className="logo"
                        onClick={() => navigate("/")}
                    >
                        <LogoIcon />
                        <span>Naveen Kalidindi</span>
                    </div>
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="icon"
                    >
                        {isDark ? <MoonIcon /> : <SunIcon />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
