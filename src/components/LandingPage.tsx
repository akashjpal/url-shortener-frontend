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

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = event.target.value;
        setUrl(newUrl);
    }

    const serverURL = process.env.SERVER_URL || "http://localhost:3001";

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("handling submit");
        await fetch(`${serverURL}/url`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: url,
            }),
        })
            .then(async (response: Response) => {

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
            .catch((error: Error) => {
                console.log(error);
                setError("Error try after sometime");
            })
    }

    const showError = (error: string) => {
        return error ? <div className="error-text">{error}</div> : null;
    };

    const handleCopy = () => {
        if (res) {
            navigator.clipboard.writeText(res);
        }
    };

    const result = (res: string) => {
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