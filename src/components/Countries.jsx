import React, { useEffect, useState } from "react";
import axios from "axios";

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setCountries(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch countries");
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading countries...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">List of Countries</h1>

      <input
        type="text"
        placeholder="Search country..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <>
        Sort by:
        <select placeholder="Search country...">
          <option value={"name"}>Name</option>
        </select>
      </>

      {filteredCountries.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {filteredCountries.map((country, index) => (
            <li key={index}>
              <img
                src={country.flags.png}
                width={
                  country.name.common == "Vietnam" ? "200px" : (width = "24px")
                }
              />
              {country.name.common}
            </li>
          ))}
        </ul>
      ) : (
        <p>No countries match your search.</p>
      )}
    </div>
  );
};

export default CountryList;
