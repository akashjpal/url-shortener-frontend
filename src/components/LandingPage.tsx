'use client';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { IconButton, Tooltip } from "@mui/material";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import "@/components/LandingPage.scss";

export default function LandingPage() {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const [res, setRes] = useState("");

    const onChange = (event: any) => {
        const newUrl = event.target.value;
        setUrl(newUrl);
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        fetch("http://localhost:3001/url", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                url: url,
            })
        })
            .then(async (response: any) => {

                if (response.status === 200) {
                    const result = await response.json();
                    console.log(result)
                    if (result?.data.urlModel?.shortenedurl) {
                        setRes(result?.data.urlModel?.shortenedurl);
                        setError("");
                    } else {
                        setError("Unexpected format");
                    }
                } else if (response.status === 204) {
                    setError("Wrong URL");
                    setRes("");
                } else if (response.status === 400) {
                    setError("Bad request try to check input");
                    setRes("");
                }
            })
            .catch((error: any) => {
                console.log(error);
                setError("Error try after sometime");
            })
    }

    const showError = (error: any) => {
        return error ? <div className="error-text">{error}</div> : null;
    };

    const handleCopy = () => {
        if (res) {
            navigator.clipboard.writeText(res);
        }
    }

    const result = (res: any) => {
        return res ? (
            <div className="result-text-wrapper">
                <div className="result-text">
                    {res}
                </div>
                <Tooltip title="Copy" placement="top">
                    <IconButton onClick={handleCopy}>
                        <ContentCopy />
                    </IconButton>
                </Tooltip>
            </div>
        ) : null;
    }

    return (
        <div className="main-section-wrapper">
            <div className="header-wrapper">
                <InsertLinkIcon />
                <div className="header-wrapper-heading">
                    ShortLink
                </div>
            </div>
            <div className="form-wrapper">
                <Box
                    component="form"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        error={error != ""}
                        id="filled-error"
                        label="Enter Your Long URL"
                        variant="filled"
                        onChange={onChange}
                    />
                    <div>
                        {showError(error)}
                        {result(res)}
                    </div>
                    <Button variant="contained" type="submit">Shorten URL</Button>
                </Box>
                <div>
                </div>
            </div>
        </div>
    )
}