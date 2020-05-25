import TextField from "@material-ui/core/TextField";
import React from "react";

const Search = (props) => {
    return <TextField
        variant="outlined"
        type='text'
        onChange={(e) => props.onChange(e)}
    />;
}

export default Search;