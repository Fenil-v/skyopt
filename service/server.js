import express from "express";
import dotenv from "dotenv";
import initialize from "./services/config.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
initialize(app);

app.listen(port, () => {
	console.log(`Lisitng up and running at port ${port}`);
});
