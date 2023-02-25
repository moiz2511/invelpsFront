import React, { useState } from 'react'
import PageInfoDailog from './PageInfoDailog';
import InfoIcon from '@mui/icons-material/Info';
import { Breadcrumbs, Card, IconButton, Tooltip, Typography } from '@mui/material';

const PageInfoBreadCrumbs = (props) => {
    const pagePath = props.data.trim().replace("/", "").trim().split("/")
    const [isPageInfoDialogOpen, setIsPageInfoDialogOpen] = useState(false);
    return (
        <React.Fragment>
            <PageInfoDailog isDialogOpened={isPageInfoDialogOpen}
                handleCloseDialog={() => setIsPageInfoDialogOpen(false)}
                data={props.data} />
            <Card elevation={0} sx={{ ml: 1, mb: 1 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ml: 1}}>
                    <Typography color="inherit" >
                        {pagePath[0]}
                    </Typography>
                    <Typography
                        color="inherit"
                    >
                        {pagePath[1]}
                        <Tooltip title="Page-Info">
                            <IconButton size='small' onClick={() => { setIsPageInfoDialogOpen(true) }}> <InfoIcon color='primary' sx={{ fontSize: 14 }} /> </IconButton>
                        </Tooltip>
                    </Typography>
                    {/* <Typography color="text.primary">Breadcrumbs</Typography> */}
                </Breadcrumbs>
            </Card>
        </React.Fragment>
    );
}

export default PageInfoBreadCrumbs;