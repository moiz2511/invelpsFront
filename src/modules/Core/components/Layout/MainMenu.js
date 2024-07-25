import React, { useState } from "react";
import { Button, Menu, MenuItem, Link as MuiLink } from "@mui/material";

function NavigationMenu({ mainNavData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);

  const handleMenuOpen = (event, menuId) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menuId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  return (
    <>
      {mainNavData.map((item) => (
        <React.Fragment key={item.id}>
          <Button
            color="inherit"
            onClick={(e) => handleMenuOpen(e, item.id)}
            sx={{ color: "#fff", textTransform: "none" }}
          >
            {item.label}
          </Button>
          <Menu
            id={`menu-${item.id}`}
            anchorEl={anchorEl}
            open={Boolean(anchorEl && currentMenu === item.id)}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": `button-${item.id}`,
            }}
          >
            {item.children?.map((child) => (
              <MenuItem key={child.id} onClick={handleMenuClose}>
                <MuiLink
                  href={child.href || "/#"}
                  underline="none"
                  color="inherit"
                >
                  {child.label}
                </MuiLink>
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      ))}
    </>
  );
}

export default NavigationMenu;
