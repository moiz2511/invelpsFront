import { Tab, Tooltip } from '@mui/material'

const TabToolTip=(props)=>{

    return(
        <Tooltip title={props.title}>
            <Tab label={props.label} value={props.value} />
        </Tooltip>
    )
}
export default TabToolTip;
