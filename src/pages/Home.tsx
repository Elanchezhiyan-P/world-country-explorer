import { useEffect, useState } from "react";
import { fetchData } from "../services/countryService";
import Loader from "../components/Loader/Loader";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const [countries, setCountries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>("name-asc");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchData("all");
        await delay(3000);
        setCountries(data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    loadCountries();
  }, []);

  const filteredCountries = search
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : countries;

  const sortedCountries = [...filteredCountries].sort((a, b) => {
    if (sortOption === "name-asc") {
      return a.name.common.localeCompare(b.name.common);
    } else if (sortOption === "name-desc") {
      return b.name.common.localeCompare(a.name.common);
    } else if (sortOption === "region-asc") {
      return a.region.localeCompare(b.region);
    } else if (sortOption === "region-desc") {
      return b.region.localeCompare(a.region);
    }
    return 0;
  });

  return (
    <div className="container-fluid">
      <h1 className="text-center my-4 text-primary">Countries List</h1>

      <div className="row mb-4">
        <div className="col-12 d-flex flex-column flex-md-row justify-content-md-end align-items-md-center">
          {/* Search Field */}
          <div className="d-flex align-items-center mb-2 mb-md-0 me-md-3">
            <label htmlFor="searchCountry" className="form-label me-2">
              Search:
            </label>
            <input
              type="search"
              id="searchCountry"
              className="form-control form-control-sm w-auto"
              placeholder="Search country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="d-flex align-items-center">
            <label htmlFor="sortDropdown" className="form-label me-2">
              Sort By:
            </label>
            <select
              id="sortDropdown"
              className="form-select form-select-sm w-auto"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              disabled={isLoading}
            >
              <option value="name-asc">Country Name-Asc</option>
              <option value="name-desc">Country Name-Desc</option>
              <option value="region-asc">Region-Asc</option>
              <option value="region-desc">Region-Desc</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        {sortedCountries.map((country: any) => (
          <div
            className="col-12 col-sm-6 col-md-4 pb-4 country-card"
            key={country.cca3}
          >
            <div
              className="card shadow border-primary"
              style={{ width: "100%" }}
            >
              <div className="card-body">
                <h5 className="card-title text-success">
                  {country.name.common}
                </h5>
                <span className="flag-tag float-end">
                  <img src={country.flags.svg} alt={country.name.common} />
                </span>
                <h6 className="card-subtitle mb-2 text-muted">
                  {country.name.official}
                </h6>
                <p className="card-text text-info">
                  <strong>Region:</strong> {country.region}
                </p>

                <div className="d-flex justify-content-between mt-3">
                  <a
                    href={country.maps.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Google Maps
                  </a>
                  <a
                    href={country.maps.openStreetMap}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    OpenStreetMap
                  </a>
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={() =>
                      navigate(`/country-details/${country.name.common}`)
                    }
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && <Loader />}
        {!isLoading && error && (
          <div className="alert alert-danger mt-4">
            Error in loading the data
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
