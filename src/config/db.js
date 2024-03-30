import pg from "pg";
const { Client } = pg;

const client = new Client({
  host: "dpg-co2nn8g21fec73b13b7g-a.oregon-postgres.render.com",
  port: 5432,
  database: "bank_5vdm",
  user: "bank_5vdm_user",
  password: "nvd3Muuq7p8IlKpwe0BaFb6zT8KEHSZ6",
  ssl: {
    rejectUnauthorized: false 
  }
});

client.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

export default client;
