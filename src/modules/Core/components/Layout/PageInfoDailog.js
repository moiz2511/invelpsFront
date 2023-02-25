import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react'
import PageInfoTextConstants from '../../constants/PageInfoTextConstants.json'

const PageInfoDailog = ({ isDialogOpened, handleCloseDialog, data }) => {
    const pagePath = data.trim().replace("/", "").trim().replace("/", "_")
    const [renderDailog, setRenderDailog] = useState(false);
    const infoData = PageInfoTextConstants[pagePath];
    useEffect(() => {
        if (infoData !== "" && infoData !== undefined && infoData !== null) {
            setRenderDailog(true);
        }
    }, [infoData]);
    const handleClose = () => {
        handleCloseDialog(false);
    };
    return (
        <React.Fragment>
            {renderDailog && <Dialog
                open={isDialogOpened}
                onClose={handleClose}
                // scroll='paper'
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"

            >
                <DialogTitle id="scroll-dialog-title" sx={{ textAlign: 'center', backgroundColor: '#407879' }}>Page Info</DialogTitle>
                <DialogContent >
                    <DialogContentText
                        id="scroll-dialog-description"
                        // tabIndex={-1}
                        sx={{ whiteSpace: "pre-wrap" }}
                    >
                        {infoData ? infoData : ""}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{justifyContent: 'center' }}>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            }
        </React.Fragment>
    );
};

export default PageInfoDailog;
