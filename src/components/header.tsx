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
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import useApiService from "@/service/useApiService";
import { useRouter } from "next/router";

const pages = [
  { text: "ongoing", path: "/" },
  { text: "tournaments", path: "tournaments" },
];
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
function Header({ id }: { id?: number }) {
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

  const createQueryString = useCallback(
    (name?: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (name && value) {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams]
  );

  return (
    <AppBar position="sticky" color="inherit">
      <Container maxWidth="xl" className="max-w-6xl">
        <Toolbar disableGutters>
          <Link href={{ pathname: "/" }}>
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
                <Link href={{ pathname: page.path }} key={page.text}>
                  <MenuItem
                    onClick={handleCloseNavMenu}
                    color="primary"
                    href={page.path}
                    selected={
                      pathname === "/" + page.path || pathname === page.path
                    }
                    className="uppercase"
                  >
                    <Typography
                      textAlign="center"
                      className={
                        pathname === "/" + page.path || pathname === page.path
                          ? "!font-bold"
                          : ""
                      }
                    >
                      {page.text}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link href={{ pathname: page.path }} key={page.text}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, display: "block" }}
                  className={
                    pathname === "/" + page.path || pathname === page.path + id
                      ? "!font-bold"
                      : ""
                  }
                >
                  {page.text}
                </Button>
              </Link>
            ))}
          </Box>

          <Box
            sx={{ flexGrow: 0 }}
            className="flex items-center font-mono text-sm"
          >
            <span className="pr-4"> By</span>
            <Image
              src="/sraddha.png"
              alt="Vercel Logo"
              className="dark:invert"
              width={30}
              height={45}
              priority
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
