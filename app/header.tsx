"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useApiService from "./service/useApiService";
import { useEffect, useCallback } from "react";

const pages = ["matches", "table"];
interface GameList {
  data: [
    {
      id: number;
      attributes: {
        name: string;
        isActive: boolean;
      };
    }
  ];
}
function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const { data: gameList, loading: gameListLoading } =
    useApiService<GameList>("games");
  useEffect(() => {
    if (!gameList?.data?.length) return;
    window.localStorage.setItem("gameList", JSON.stringify(gameList));
    gameList?.data.forEach((element) => {
      if (element.attributes.isActive) {
        window.localStorage.setItem("activeGame", element.attributes.name);
      }
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameList]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  let activeGame = "";
  if (typeof window !== "undefined") {
    activeGame = window.localStorage.getItem("activeGame") || "";
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    activeGame = window.localStorage.getItem("activeGame") || "";
    if (activeGame)
      router.push(pathname + "?" + createQueryString("game", activeGame || ""));
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppBar position="sticky" color="inherit">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href={"/" + "?" + createQueryString("game", activeGame)}>
            <Image
              src="/Seidor.png"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <Link
                  href={page + "?" + createQueryString("game", activeGame)}
                  key={page}
                >
                  <MenuItem
                    onClick={handleCloseNavMenu}
                    color="primary"
                    href={page}
                    selected={pathname === page ? true : false}
                    className="uppercase"
                  >
                    <Typography
                      textAlign="center"
                      className={
                        pathname === "/" + (page === "matches" ? "" : page)
                          ? "!font-bold"
                          : ""
                      }
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link
                href={page + "?" + createQueryString("game", activeGame)}
                key={page}
              >
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, display: "block" }}
                  className={
                    pathname === "/" + (page === "matches" ? "" : page)
                      ? "!font-bold"
                      : ""
                  }
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>

          <Box
            sx={{ flexGrow: 0 }}
            className="flex items-center font-mono text-sm"
          >
            By
            <Image
              src="/sraddha.png"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
