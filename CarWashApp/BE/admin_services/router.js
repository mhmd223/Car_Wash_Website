import express from "express";
import accountRouter from "./account_services/account_services.js";
import categoryRouter from "./category_services/category_services.js";
import washRouter from "./wash_services/wash_services.js";
import { roles } from "../data/roles.js";

const router = express.Router();

router.use((req, res, next) => {
  if (!req.session.user || req.session.user.role !== roles.ADMIN) {
    res.status(403).json({ status: "Unauthorized" });
    return;
  }
      console.log(
        "Unauthorized access attempt by user:",
        req.session.user?.email,
      );

  next();
});

router.use("/Users", accountRouter);
router.use("/category", categoryRouter);
router.use("/wash", washRouter);

export default router;
