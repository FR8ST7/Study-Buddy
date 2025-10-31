import React, { useEffect, useState } from "react";
import axios from "axios";

const DatabaseItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/items")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Items from Database</h1>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item._id} className="border p-2 rounded">
            {item.name} — ₹{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatabaseItems;
