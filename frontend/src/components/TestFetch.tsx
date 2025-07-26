import React, { useEffect, useState } from "react";

const TestFetch = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          credentials: "include",
        });

        if (response.ok) {
          const json = await response.json();
          setData(json);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Test Backend Response</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestFetch;
