import { useState } from 'react';
import viteLogo from '/vite.svg';
import './App.css';
import APIForm from './Components/APIform';
import Gallery from './Components/Gallery';

function App() {
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;


  const [prevImages, setPrevImages] = useState([]);
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });

  const [currentImage, setCurrentImage] = useState(null);

  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    });
  };

  const callAPI = async (query) => {
    try {
      const response = await fetch(query);
      const json = await response.json();

      if (!json.url) {
        alert("Oops! Something went wrong with that query. Let's try again!");
      } else {
        setCurrentImage(json.url);
        setPrevImages((images) => [...images, json.url]);
        reset();
        getQuota();
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("Failed to fetch screenshot. Check console for details.");
    }
  };

  const makeQuery = () => {
    const wait_until = "network_idle";
    const response_type = "json";
    const fail_on_status = "400%2C404%2C500-511";
    const url_starter = "https://";
    const fullURL = url_starter + inputs.url;

    const query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;

    callAPI(query).catch(console.error);
  };

  const submitForm = () => {
    const defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    };

    if (inputs.url.trim() === "") {
      alert("You forgot to submit a URL!");
      return;
    }

    const filledInputs = { ...inputs };
    for (const [key, value] of Object.entries(filledInputs)) {
      if (value.trim() === "") {
        filledInputs[key] = defaultValues[key];
      }
    }

    setInputs(filledInputs); // update with defaults if needed
    makeQuery();
const [quota, setQuota] = useState(null);
const getQuota = async () => {
  const response = await fetch("https://api.apiflash.com/v1/urltoimage/quota?access_key=" + ACCESS_KEY);
  const result = await response.json();

  setQuota(result);
}

  };

  return (
    <div className="whole-page">
      <h1>Build Your Own Screenshot! 📸</h1>

      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />
      {quota ? (
  <p className="quota">
    {" "}
    Remaining API calls: {quota.remaining} out of {quota.limit}
  </p>
) : (
  <p></p>
)}

      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot returned"
        />
      ) : (
        <div>No screenshot yet. Submit a URL above.</div>
      )}

      <div className="container">
        <Gallery images={prevImages} />
      </div>
      <h3>Current Query Status:</h3>
      <p>
        https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY<br />
        &url={inputs.url} <br />
        &format={inputs.format} <br />
        &width={inputs.width} <br />
        &height={inputs.height} <br />
        &no_cookie_banners={inputs.no_cookie_banners} <br />
        &no_ads={inputs.no_ads} <br />
      </p>
    </div>

  );
}

export default App;
