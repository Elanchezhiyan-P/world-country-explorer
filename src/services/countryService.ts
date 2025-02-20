import axios from "axios";

const BASE_URL = "https://restcountries.com/v3.1";

export const fetchData = async (
  endpointType: "all" | "name" | "currency" | "lang",
  value: string = ""
) => {
  let url = "";

  switch (endpointType) {
    case "all":
      url = `${BASE_URL}/all`;
      break;
    case "name":
      url = `${BASE_URL}/name/${value}?fullText=true`; // Full-text search for country by name
      break;
    case "currency":
      url = `${BASE_URL}/currency/${value}`;
      break;
    case "lang":
      url = `${BASE_URL}/lang/${value}`;
      break;
    default:
      throw new Error("Invalid endpoint type");
  }

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
