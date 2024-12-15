import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import { deepPurple } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { getToken } from "./Helpers";
import { logout } from "../services/_requests";
import { useTranslation } from "../../node_modules/react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import i18n from "../i18n";

const pages = ["View Bookings"];
const settings = ["Profile", "Logout"];

function NavBar({
  userName,
}: {
  userName?: { firstName: string; lastName: string };
}) {
  const token = getToken();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async (value: string) => {
    if (value === "Logout") {
      const { status } = await logout(token);
      if (status === 200) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  const { t } = useTranslation();
  const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    handleCloseLangMenu();
  };

  const handleSettingsClick = (setting: string) => {
    if (setting === "Logout") {
      handleLogout(setting);
    } else if (setting === "Profile") {
      navigate("/profile");
    }
    handleCloseUserMenu();
  };

  return (
    <AppBar
      position="sticky"
      sx={{ top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            src="/assets/images/skyoptlogo.jpg"
            alt="Logo"
            style={{ width: "30px", height: "30px", padding: "10px"}}
          />

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SKYOPT
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={t(page)} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    {t(page)}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SKYOPT
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <Button
                key={t(page)}
                onClick={() => {
                  if (page === "View Bookings") {
                    navigate("/bookings");
                  }
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {t(page)}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Language Selector */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Select Language">
                <IconButton
                  onClick={handleOpenLangMenu}
                  sx={{ color: "white" }}
                >
                  <LanguageIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-lang"
                anchorEl={anchorElLang}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElLang)}
                onClose={handleCloseLangMenu}
              >
                {["en", "hi", "es", "gu"].map((lang) => (
                  <MenuItem key={lang} onClick={() => changeLanguage(lang)}>
                    <Typography textAlign="center">
                      {lang.toUpperCase()}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* User Profile */}
            <Box sx={{ flexGrow: 0 }}>
              {isLoggedIn ? (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: deepPurple[500] }}>
                      {userName?.firstName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              ) : (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/login")}
                    sx={{
                      my: 2,
                      color: "white",
                      display: "block",
                      backgroundColor: "#002884",
                    }}
                  >
                    {t("Login")}
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/sign-up")}
                    sx={{
                      my: 2,
                      color: "white",
                      display: "block",
                      backgroundColor: "#00a152",
                    }}
                  >
                    {t("Sign Up")}
                  </Button>
                </Box>
              )}
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleSettingsClick(setting)}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {t(setting)}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
