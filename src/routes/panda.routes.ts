import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
  getMyPandas,
} from "../controllers/panda.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware"                                                        
import { pandaSchema } from "../schemas/schemas"

const router = Router();

router.get("/", getAll);
router.get("/my", protect, getMyPandas);
router.get("/:id", getOne);
router.post("/", protect, validate(pandaSchema), create)
router.put("/:id", protect, validate(pandaSchema.partial()), update)
router.delete("/:id", protect, remove);

export default router;
