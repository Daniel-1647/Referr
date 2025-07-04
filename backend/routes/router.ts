import express from "express";

import authRoutes from "./auth.routes";
import statsRoutes from "./stats.routes";
import userRoutes from "./user.routes";

const router = express.Router();

export default (): express.Router => {
  authRoutes(router);
  statsRoutes(router);
  userRoutes(router);
  return router;
};
