import { api } from "../config/api";

api
	.get("/test-endpoint")
	.then((response) => {
		console.log("API Response:", response.data);
	})
	.catch((error) => {
		console.error("API Error:", error);
	});
