'use client';
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error,setError] = useState("");
  const [res,setRes] = useState("");
  const onChange = (event: any) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
  }
  const handleSubmit = (event:any) =>{
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
    .then( async (response:any) => { 

      if(response.status === 200){
        const result = await response.json();
        console.log(result)
        if(result?.data.urlModel?.shortenedurl){
          setRes(result?.data.urlModel?.shortenedurl);
          setError("");
        }else{
          setError("Unexpected format");
        }
      }else if(response.status === 204){
        setError("Wrong URL");
        setRes("");
      }else if(response.status === 400){
        setError("Bad request try to check input");
        setRes("");
      }
    })
    .catch((error: any)=>{
      console.log(error);
      setError("Error try after sometime");
    })
  }

  const showError = (error:any) => {
    return error ? <div className="text-red-500">{error}</div> : null;
  };

  const result = (res: any) => {
    return res ? <div className="text-grey-300">{res}</div> : null;
  }
  
  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <label htmlFor="url">Enter Url: </label>
        <input id="url" type="text" name="url" value={url} onChange={onChange} />
        <button type="submit">Submit</button>
        {result(res)}
        {showError(error)}
      </form>
    </div>
  );
}
