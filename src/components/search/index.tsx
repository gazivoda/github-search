import TextField from "@material-ui/core/TextField";
import React, { Fragment } from "react";
import { LinearProgress } from "@material-ui/core";

const Search = (props) => {
    return (
        <div className="search-field">
            <TextField
                variant="outlined"
                type='text'
                label='User Search'
                className="search-field__input"
                onChange={(e) => props.onChange(e)}
            />
            {props.loading && <LinearProgress className="searc-field__progress" />}

        </div>
    );
}

export default Search;