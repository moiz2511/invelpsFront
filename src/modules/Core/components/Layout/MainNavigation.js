import React, { useEffect, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Link as RouterLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton, {
  listItemButtonClasses,
} from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router';
import ColorConstants from '../../constants/ColorConstants.json';
import { ButtonGroup, Container } from '@mui/material';
import AuthContext from '../../store/auth-context';

import Logo from '../../../../assets/logos/Original.svg';

import '../../../../assets/styles/Navbar.css';

const pages = [
  { label: 'Home', link: '/#home' },
  { label: 'Solutions', link: '/#solutions' },
  { label: 'Applications', link: '/#applications' },
  { label: 'About us', link: '/#aboutus' },
  { label: 'Contact', link: '/contact' },
];

const StyledListItemButton = styled(ListItemButton)(() => ({
  [`&.${listItemButtonClasses.selected}`]: {
    backgroundColor: '#015d81',
  },
}));

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const subNavItemsInitialData = [
  {
    id: 1,
    isAdminNav: false,
    label: 'Analysis framework',
    pathKey: 'context',
    showSubItems: false,
    children: [
      {
        id: 11,
        label: 'Investing Style',
        path: '/context/investingstyle',
      },
      {
        id: 12,
        label: 'Screen Model',
        path: '/context/screenmodel',
      },
      {
        id: 13,
        label: 'Analysis Model',
        path: '/context/analysismodel',
      },
      {
        id: 14,
        label: 'Chart Analysis',
        path: '/context/chartanalysis',
      },
    ],
  },
  {
    id: 2,
    isAdminNav: true,
    label: 'Data Acquisition',
    pathKey: 'dataAcquisition',
    showSubItems: false,
    children: [
      {
        id: 21,
        label: 'API',
        path: '/dataAcquisition/api',
      },
      {
        id: 22,
        label: 'File Import',
        path: '/dataAcquisition/fileimport',
      },
      {
        id: 23,
        label: 'Automation',
        path: '/dataAcquisition/automation',
      },
      {
        id: 24,
        label: 'Data Control',
        path: '/dataAcquisition/datacontrol',
      },
    ],
  },
  {
    id: 3,
    isAdminNav: true,
    label: 'Data Processing',
    pathKey: 'dataprocessing',
    showSubItems: false,
    children: [
      {
        id: 31,
        label: 'Investing Style',
        path: '/dataprocessing/investingstyle',
      },
      {
        id: 32,
        label: 'Screen Model',
        path: '/dataprocessing/screenmodel',
      },
      {
        id: 33,
        label: 'Analysis Model',
        path: '/dataprocessing/analysismodel',
      },
      {
        id: 34,
        label: 'Fundamental Chart',
        path: '/dataprocessing/fundamentalchart',
      },
      {
        id: 35,
        label: 'Ranges',
        path: '/dataprocessing/ranges',
      },
      // {
      //     id: 36,
      //     label: 'Aggregate Financials',
      //     path: '/dataprocessing/aggregatefinancials'
      // },
      {
        id: 36,
        label: 'Create Metrics',
        path: '/dataprocessing/createmetrics',
      },
      // {
      //     id: 38,
      //     label: 'Advanced Metrics',
      //     path: '/dataprocessing/advancedmetrics'
      // }
    ],
  },
  {
    id: 4,
    isAdminNav: false,
    label: 'Analysis tools',
    pathKey: 'dataanalysis',
    showSubItems: false,
    children: [
      {
        id: 41,
        label: 'Screener',
        path: '/dataanalysis/screener',
      },
      {
        id: 41,
        label: 'Profile',
        path: '/dataanalysis/profile',
      },
      {
        id: 42,
        label: 'Financials',
        path: '/dataanalysis/financials',
      },
      // {
      //     id: 43,
      //     label: 'Reported Financials',
      //     path: '/dataanalysis/reportedfinancials'
      // },
      // {
      //     id: 44,
      //     label: 'Financial Notes',
      //     path: '/dataanalysis/financialnotes'
      // },
      {
        id: 45,
        label: 'Historical Data',
        path: '/dataanalysis/historicaldata',
      },
      {
        id: 46,
        label: 'Key Metrics',
        path: '/dataanalysis/keymetrics',
      },
      {
        id: 47,
        label: 'Fundamental Chart',
        path: '/dataanalysis/fundamentalchart',
      },
      {
        id: 48,
        label: 'Linear Regression',
        path: '/dataanalysis/linearregression',
      },
      {
        id: 49,
        label: 'Ranges',
        path: '/dataanalysis/ranges',
      },
      // {
      //     id: 410,
      //     label: 'Rates',
      //     path: '/dataanalysis/rates'
      // }
    ],
  },
  // {
  //     id: 5,
  //     isAdminNav: false,
  //     label: 'Data Visualization',
  //     path: '/datavisualization',
  //     pathKey: 'datavisualization',
  //     showSubItems: false,
  //     children: []
  // },
  {
    id: 6,
    isAdminNav: true,
    label: 'Manage Users',
    path: '/admin/manageUsers',
    pathKey: 'admin',
    showSubItems: false,
    children: [],
  },
  {
    id: 7,
    isAdminNav: true,
    label: 'Manage Contacts',
    path: '/admin/manageContacts',
    pathKey: 'admin',
    showSubItems: false,
    children: [],
  },
];

const achorStyle = { textDecoration: 'none', color: '#ccbf90' };

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const isUserLoggeIn = authCtx.isLoggedIn;
  const location = useLocation();
  const pagePath = location.pathname;
  const [state, setState] = React.useState(false);
  const [selectedNavItem, setSelectedNavItem] = React.useState(11);
  const [subNavItemsData, setSubNavItemsData] = React.useState(
    subNavItemsInitialData
  );
  const tooggleSideNavMenu = () => {
    setState(!state);
  };
  useEffect(() => {
    if (pagePath !== null && pagePath !== '' && pagePath !== '/') {
      const selItem = pagePath.split('/');
      if (selItem.length > 2 && selItem[1] !== '') {
        let selObject = subNavItemsData.filter(
          (item) => item.pathKey === selItem[1]
        );
        if (selObject.length > 0) {
          if (
            selObject.length > 0 &&
            selObject[0].children.length > 0 &&
            !selObject[0].showSubItems
          ) {
            handleSubNavItems(selObject[0].id);
          }
          selObject = selObject.map((subItem) =>
            subItem.children.filter((childItem) => childItem.path === pagePath)
          );
          setSelectedNavItem(selObject[0].id);
        }
      } else if (selItem.length === 2 && selItem[1] !== '') {
        let selObject = subNavItemsData.filter(
          (item) => item.pathKey === selItem[1]
        );
        if (selObject.length > 0) {
          setSelectedNavItem(selObject[0].id);
        }
      }
    }
  }, [pagePath]);

  const handleSubNavItems = (id) => {
    let testData = subNavItemsData.map((item) => {
      if (item.id === id) {
        item.showSubItems = !item.showSubItems;
      }
      return item;
    });
    setSubNavItemsData(testData);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        elevation={2}
        position='fixed'
        sx={{
          height: '90px',
          justifyContent: 'center',
          backgroundColor: '#407879',
          mb: 0,
          zIndex: (theme) => theme.zIndex.drawer + 4,
        }}
      >
        <Container maxWidth='xl'>
          <Toolbar
            elevation={2}
            disableGutters
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {authCtx.isLoggedIn && (
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={tooggleSideNavMenu}
                  // color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              )}
              {/* <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ display: { xs: "none", md: "flex" } }}
                            >
                                LOGO
                            </Typography> */}
              {/* <img alt="tickers logo" width={100} height={50} src={Logo} /> */}
              <img src={Logo} height='50px' alt='invelps' />
              {/* <img alt="tickers logo2" width={100} height={50} src={logo2} /> */}
              {/* <img alt="tickers logo3" width={100} height={50} src={logo3} /> */}
            </div>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {/* {pages.map((page) => (
                                <Button
                                    key={page.label}
                                    component={RouterLink}
                                    to={page.link}
                                    sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none', mr: 3 }}
                                >
                                    {page.label}
                                </Button>
                            ))} */}
              <ul
                className='navbar-list'
                style={{ justifyContent: 'space-between' }}
              >
                <a href='/#home' style={achorStyle}>
                  <li>Home</li>
                </a>
                <a href='/#solutions' style={achorStyle}>
                  <li>Solutions</li>
                </a>
                <a href='/#applications' style={achorStyle}>
                  <li>Applications</li>
                </a>
                <a href='/#aboutus' style={achorStyle}>
                  <li>About Us</li>
                </a>
                <RouterLink to='/contact' style={achorStyle}>
                  <li>Contact</li>
                </RouterLink>
                {!isUserLoggeIn && (
                  <React.Fragment>
                    <RouterLink to='/login' style={achorStyle}>
                      <li>Login</li>
                    </RouterLink>
                    <RouterLink to='/signup' style={achorStyle}>
                      <li>SignUp</li>
                    </RouterLink>
                  </React.Fragment>
                )}
                {
                  isUserLoggeIn && (
                    <RouterLink
                      to='/logout'
                      onClick={() => {
                        authCtx.logout();
                      }}
                      style={achorStyle}
                    >
                      Logout
                    </RouterLink>
                  )
                  // <Button
                  //     key="logout"
                  //     onClick={() => { authCtx.logout() }}
                  //     sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}
                  // >
                  //     Logout
                  // </Button>
                }
              </ul>
              {/* {!isUserLoggeIn && <React.Fragment>
                                <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                                    <Button
                                        key="login"
                                        component={RouterLink}
                                        to="/login"
                                        sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        key="signup"
                                        component={RouterLink}
                                        to="/signup"
                                        sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}
                                    >
                                        SignUp
                                    </Button>
                                </ButtonGroup>
                            </React.Fragment>} */}
              {/* <Tooltip title="Open settings" sx={{ mr: 1 }}>
                                <IconButton>
                                    <Avatar>FR</Avatar>
                                </IconButton>
                            </Tooltip> */}
            </Box>
          </Toolbar>
        </Container>
        <Drawer
          anchor='left'
          open={state}
          onClose={tooggleSideNavMenu}
          sx={{
            minWidth: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              minWidth: 240,
              boxSizing: 'border-box',
              backgroundColor: ColorConstants.APP_SIDE_NAV_BG_COLOR,
            },
          }}
        >
          <List
            sx={{
              paddingTop: '95px',
              width: '100%',
              maxWidth: 240,
              bgcolor: ColorConstants.APP_SIDE_NAV_BG_COLOR,
              color: 'white',
            }}
            component='nav'
          >
            {subNavItemsData.map((item) => {
              if (item.isAdminNav && authCtx.role === 'Admin') {
                if (
                  (item.children !== null) | undefined &&
                  item.children.length > 0
                ) {
                  return (
                    <React.Fragment key={item.id}>
                      <StyledListItemButton
                        onClick={() => handleSubNavItems(item.id)}
                      >
                        <ListItemText primary={item.label} />
                        {item.showSubItems ? (
                          <ExpandLess />
                        ) : (
                          <KeyboardArrowRight />
                        )}
                      </StyledListItemButton>
                      <Collapse
                        in={item.showSubItems}
                        timeout='auto'
                        unmountOnExit
                      >
                        <List component='div' disablePadding>
                          {item.children.map((subItem) => (
                            <StyledListItemButton
                              key={subItem.id}
                              selected={selectedNavItem === subItem.id}
                              onClick={() => {
                                setSelectedNavItem(subItem.id);
                                tooggleSideNavMenu();
                              }}
                              component={RouterLink}
                              to={subItem.path}
                              sx={{ pl: 4 }}
                            >
                              <ListItemText primary={subItem.label} />
                            </StyledListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  );
                } else {
                  return (
                    <StyledListItemButton
                      key={item.id}
                      selected={selectedNavItem === item.id}
                      onClick={() => {
                        tooggleSideNavMenu();
                      }}
                      component={RouterLink}
                      to={item.path}
                    >
                      <ListItemText primary={item.label} />
                    </StyledListItemButton>
                  );
                }
              } else if (!item.isAdminNav) {
                if (
                  (item.children !== null) | undefined &&
                  item.children.length > 0
                ) {
                  return (
                    <React.Fragment key={item.id}>
                      <StyledListItemButton
                        onClick={() => handleSubNavItems(item.id)}
                      >
                        <ListItemText primary={item.label} />
                        {item.showSubItems ? (
                          <ExpandLess />
                        ) : (
                          <KeyboardArrowRight />
                        )}
                      </StyledListItemButton>
                      <Collapse
                        in={item.showSubItems}
                        timeout='auto'
                        unmountOnExit
                      >
                        <List component='div' disablePadding>
                          {item.children.map((subItem) => (
                            <StyledListItemButton
                              key={subItem.id}
                              selected={selectedNavItem === subItem.id}
                              onClick={() => {
                                setSelectedNavItem(subItem.id);
                                tooggleSideNavMenu();
                              }}
                              component={RouterLink}
                              to={subItem.path}
                              sx={{ pl: 4 }}
                            >
                              <ListItemText primary={subItem.label} />
                            </StyledListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  );
                } else {
                  return (
                    <StyledListItemButton
                      key={item.id}
                      selected={selectedNavItem === item.id}
                      onClick={() => {
                        tooggleSideNavMenu();
                      }}
                      component={RouterLink}
                      to={item.path}
                    >
                      <ListItemText primary={item.label} />
                    </StyledListItemButton>
                  );
                }
              }
            })}
          </List>
        </Drawer>
      </AppBar>
      <Offset style={{ paddingTop: '40px' }} />
    </Box>
  );
};

export default MainNavigation;
