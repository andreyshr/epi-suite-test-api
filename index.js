import express from "express";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();
const PORT = 3000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else if (origin) {
    return res.status(403).json({ error: "Not allowed" });
  }
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

async function getPropertiesByCas(cas) {
  const response = await fetch(`${process.env.API_BASE_URL}/submit?cas=${cas}`);
  if (!response.ok) {
    throw new Error(`EpiSuite API error: ${response.status}`);
  }
  return response.json();
}

app.get("/:cas", async (req, res) => {
  try {
    const cas = req.params.cas;
    const data = await getPropertiesByCas(cas);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
