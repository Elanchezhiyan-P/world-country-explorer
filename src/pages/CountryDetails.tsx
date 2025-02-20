import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../services/countryService";
import Loader from "../components/Loader/Loader";

const CountryDetails: React.FC = () => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const { name } = useParams<{ name: string }>();
  const [countryData, setCountryData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCountryDetails = async () => {
      try {
        var countryDetails = await fetchData("name", name);
        console.log(countryDetails);
        await delay(2000);
        setCountryData(countryDetails);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    loadCountryDetails();
  }, []);

  const isNativeName = (named: any): named is { common: string } => {
    return typeof named === "object" && "common" in named;
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center my-4 text-primary">
        Country Details - {name}
      </h1>
      <div className="text-end my-3">
        <button
          onClick={() => (window.location.href = "/")}
          className="btn btn-outline-primary"
          disabled={isLoading}
        >
          Back to Home
        </button>
      </div>
      <div>
        {countryData.map((data: any) => (
          <div className="card mb-4 p-4 shadow" key={data.cca3}>
            <div className="row">
              <div className="col-md-8">
                <h2 className="card-title text-dark">
                  {data.name.common} ({data.name.official})
                </h2>

                <div className="row my-3">
                  <div className="col-md-6">
                    <p className="bg-light p-2 rounded">
                      <strong>Capital:</strong> {data.capital.join(", ")}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="bg-light p-2 rounded">
                      <strong>Region:</strong> {data.region}
                    </p>
                  </div>
                </div>

                <div className="row my-3">
                  <div className="col-md-6">
                    <p className="bg-light p-2 rounded">
                      <strong>Subregion:</strong> {data.subregion}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="bg-light p-2 rounded">
                      <strong>Area:</strong> {data.area.toLocaleString()} km²
                    </p>
                  </div>
                </div>

                <div className="row my-3">
                  <div className="col-md-6">
                    <p className="bg-light p-2 rounded">
                      <strong>Population:</strong>{" "}
                      {data.population.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="bg-light p-2 rounded">
                      <strong>Currency:</strong>{" "}
                      {data.currencies[Object.keys(data.currencies)[0]].name} (
                      {data.currencies[Object.keys(data.currencies)[0]].symbol})
                    </p>
                  </div>
                </div>

                <div className="row my-3">
                  <div className="col-md-6">
                    <p className="bg-light p-2 rounded">
                      <strong>Languages: </strong>
                      {data.languages != undefined
                        ? Object.values(data.languages).join(", ")
                        : "None"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="bg-light p-2 rounded">
                      <strong>United Nation Member: </strong>
                      {data.unMember ? (
                        <span
                          style={{
                            padding: "6px",
                            backgroundColor: "green",
                            color: "white",
                            borderRadius: "8px",
                          }}
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          style={{
                            padding: "6px",
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: "8px",
                          }}
                        >
                          Inactive
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="my-3">
                  <p className="bg-light p-2 rounded">
                    <strong>Borders:</strong>{" "}
                    {data.borders != undefined
                      ? data.borders.join(", ")
                      : "None"}
                  </p>
                  <p className="bg-light p-2 rounded">
                    <strong>Time Zone:</strong> {data.timezones.join(", ")}
                  </p>
                </div>

                <div className="my-3">
                  <h3 className="text-info">Maps</h3>
                  <div className="d-flex gap-2">
                    <a
                      href={data.maps.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                    >
                      Google Maps
                    </a>
                    <a
                      href={data.maps.openStreetMap}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-secondary"
                    >
                      OpenStreetMap
                    </a>
                  </div>
                  <br />
                  <h3 className="text-info">Native Names</h3>
                  <ul className="list-unstyled">
                    {Object.entries(data.name.nativeName).map(
                      ([lang, named]) => {
                        if (isNativeName(named)) {
                          return (
                            <li key={lang} className="bg-light p-2 rounded">
                              <strong>{lang.toUpperCase()}:</strong>{" "}
                              {named.common}
                            </li>
                          );
                        }
                        return null;
                      }
                    )}
                  </ul>
                </div>
              </div>

              <div className="col-md-4 text-center">
                <div className="my-3">
                  <img
                    src={data.flags.svg}
                    alt={`Flag of ${data.name.common}`}
                    className="img-fluid"
                    style={{
                      width: "250px",
                      marginBottom: "20px",
                      border: "2px solid #ddd",
                      borderRadius: "10px",
                      padding: "5px",
                    }}
                  />
                </div>
                <div className="my-3">
                  {data.coatOfArms &&
                  Object.keys(data.coatOfArms).length > 0 ? (
                    <img
                      src={data.coatOfArms.svg}
                      alt="Coat of Arms"
                      className="img-fluid"
                      style={{ width: "200px" }}
                    />
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && <Loader />}
        {error && (
          <div className="alert alert-danger mt-4">
            The country data is not loaded...
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryDetails;
