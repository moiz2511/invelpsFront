import React from 'react'


const CustomProgressBar = ({ bgcolor, progress, height, showBarText, textToDisplay }) => {

    const Parentdiv = {
        height: height,
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
        justifyContent: 'center',
        textAlign: 'center',
        // margin: 50
    }

    const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: bgcolor,
        borderRadius: 40,
        textAlign: 'center'
    }

    const progresstext = {
        // padding: 10,
        color: 'black',
        fontWeight: 900
    }

    return (
        <div style={Parentdiv}>
            <div style={Childdiv}>
                <span style={progresstext}>{showBarText ? textToDisplay : ""}</span>
            </div>
        </div>
    )
}

export default CustomProgressBar;
