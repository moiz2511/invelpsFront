// import * as React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import Container from '@mui/material/Container';
// import Button from '@mui/material/Button';
// import { Link as RouterLink } from 'react-router-dom';
// import { useNavigate, useLocation } from "react-router";
// // 'Data Processing', 'Data Analysis', 'Data Visualization'
// const subNavItemsData = [
//     {
//         id: 1,
//         label: 'Context',
//         subNavName: 'context',
//         path: "/context/investingstyle"
//     },
//     {
//         id: 2,
//         label: 'Data Acquisition',
//         subNavName: 'dataAcquisition',
//         path: "/context/investingstyle"
//     },
//     {
//         id: 3,
//         label: 'Data Processing',
//         subNavName: 'dataprocessing',
//         path: "/context/investingstyle"
//     },
//     {
//         id: 4,
//         label: 'Data Analysis',
//         subNavName: 'dataanalysis',
//         path: "/context/investingstyle"
//     },
//     {
//         id: 5,
//         label: 'Data Visualization',
//         subNavName: 'datavisualization',
//         path: "/datavisualization"
//     }
// ];

// const subSubNavItemsData = {
//     "context": [
//         {
//             id: 11,
//             label: 'Investing Style',
//             path: '/context/investingstyle'
//         },
//         {
//             id: 12,
//             label: 'Screen Model',
//             path: '/context/screenmodel'
//         },
//         {
//             id: 13,
//             label: 'Analysis Model',
//             path: '/context/analysismodel'
//         }
//     ],
//     "dataAcquisition": [
//         {
//             id: 21,
//             label: 'API',
//             path: '/dataAcquisition/api'
//         },
//         {
//             id: 22,
//             label: 'File Import',
//             path: '/dataAcquisition/fileimport'
//         }
//     ],
//     "dataprocessing": [
//         {
//             id: 31,
//             label: 'Investing Style',
//             path: '/dataprocessing/investingstyle'
//         },
//         {
//             id: 32,
//             label: 'Analysis Model',
//             path: '/dataprocessing/analysismodel'
//         },
//         {
//             id: 33,
//             label: 'Screen Model',
//             path: '/dataprocessing/screenmodel'
//         },
//         {
//             id: 34,
//             label: 'Ranges',
//             path: '/dataprocessing/ranges'
//         },
//         {
//             id: 35,
//             label: 'Aggregate Financials',
//             path: '/dataprocessing/aggregatefinancials'
//         },
//         {
//             id: 36,
//             label: 'Create Metrics',
//             path: '/dataprocessing/createmetrics'
//         },
//         {
//             id: 37,
//             label: 'Advanced Metrics',
//             path: '/dataprocessing/advancedmetrics'
//         }
//     ],
//     "dataanalysis": [
//         {
//             id: 41,
//             label: 'Metric',
//             path: '/dataanalysis/metric'
//         },
//         {
//             id: 42,
//             label: 'Linear Regression',
//             path: '/dataanalysis/linearregression'
//         },
//         {
//             id: 43,
//             label: 'Financial',
//             path: '/dataanalysis/financials'
//         },
//         {
//             id: 44,
//             label: 'Profile',
//             path: '/dataanalysis/profile'
//         },
//         {
//             id: 45,
//             label: 'Financial Notes',
//             path: '/dataanalysis/financialnotes'
//         },
//         {
//             id: 46,
//             label: 'Key Metrics TTM',
//             path: '/dataanalysis/keymetricsttm'
//         },
//         {
//             id: 47,
//             label: 'Reported Financial',
//             path: '/dataanalysis/reportedfinancial'
//         },
//         {
//             id: 48,
//             label: 'Market Data',
//             path: '/dataanalysis/marketdata'
//         },
//         {
//             id: 49,
//             label: 'Ranges',
//             path: '/dataanalysis/ranges'
//         },
//         {
//             id: 410,
//             label: 'Rates',
//             path: '/dataanalysis/rates'
//         }
//     ],
//     "datavisualization": []
// }

// const SubNavigation = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     console.log(location.pathname)



//     const [subSubNavItems, setSubSubNavItems] = React.useState(subSubNavItemsData['context']);

//     const handleSubNavigation = (event) => {
//         console.log(event.target.value)
//         event.preventDefault();
//         setSubSubNavItems(subSubNavItemsData[event.target.value])
//         navigate(subSubNavItemsData[event.target.value][0].path)
//     }

//     return (
//         <React.Fragment>
//             <AppBar elevation={0} sx={{ backgroundColor: '#007AAA', boxShadow: "none", height: 30, alignContent: 'center', justifyContent: 'center', textAlign: 'center' }} position="static">
//                 <Container maxWidth="xl">
//                     <Toolbar elevation={0} disableGutters>
//                         <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
//                             {subNavItemsData.map((item) => (
//                                 <Button
//                                     size='small'
//                                     key={item.id}
//                                     onClick={handleSubNavigation}
//                                     value={item.subNavName}
//                                     sx={{ color: 'white', display: 'block' }}
//                                 >
//                                     {item.label}
//                                 </Button>
//                             ))}
//                         </Box>
//                     </Toolbar>
//                 </Container>
//             </AppBar>
//             <AppBar elevation={0} sx={{ backgroundColor: '#F2F2F2', boxShadow: "none", height: 30, alignContent: 'center', justifyContent: 'center', textAlign: 'center' }} position="static">
//                 <Container maxWidth="xl">
//                     <Toolbar elevation={0} disableGutters>
//                         <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
//                             {subSubNavItems.map((item) => (
//                                 <Button
//                                     size='small'
//                                     component={RouterLink} to={item.path}
//                                     key={item.id}
//                                     sx={{ color: 'black', display: 'block' }}
//                                 >
//                                     {item.label}
//                                 </Button>
//                             ))}
//                         </Box>
//                     </Toolbar>
//                 </Container>
//             </AppBar>
//         </React.Fragment>
//     );
// };

// export default SubNavigation;
