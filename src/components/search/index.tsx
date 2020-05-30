import { IconButton, LinearProgress } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import CloseIcon from '@material-ui/icons/Close';
import React, { useRef } from "react";

const Search = (props) => {
    let textInput = useRef(null);

    return (
        <div className="search-field">
            <TextField
                variant="outlined"
                type='text'
                label='User Search'
                className="search-field__input"
                inputRef={textInput}
                onChange={(e) => props.onChange(e)}
            />
            <IconButton aria-label="close" style={{ marginLeft: '-50px', marginTop: '5px', position: 'absolute' }} onClick={() => { textInput.current.value = ''; props.onChange() }}>
                <CloseIcon />
            </IconButton>
            {props.loading && <LinearProgress className="searc-field__progress" />}

        </div >
    );
}

export default Search;