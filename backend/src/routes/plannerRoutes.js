import { Router } from "express";
import * as plannerController from "../controllers/plannerController.js";
import { validate } from "../middleware/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  listTasksQuerySchema,
  createGoalSchema,
  updateGoalSchema,
} from "../validators/plannerValidators.js";
import { idParamSchema } from "../validators/noteValidators.js";

const router = Router();

router
  .route("/tasks")
  .get(validate({ query: listTasksQuerySchema }), plannerController.listTasks)
  .post(validate({ body: createTaskSchema }), plannerController.createTask);

router
  .route("/tasks/:id")
  .patch(validate({ params: idParamSchema, body: updateTaskSchema }), plannerController.updateTask)
  .delete(validate({ params: idParamSchema }), plannerController.deleteTask);

router.patch(
  "/tasks/:id/complete",
  validate({ params: idParamSchema }),
  plannerController.toggleTaskCompletion
);

router
  .route("/goals")
  .get(plannerController.listGoals)
  .post(validate({ body: createGoalSchema }), plannerController.createGoal);

router
  .route("/goals/:id")
  .patch(validate({ params: idParamSchema, body: updateGoalSchema }), plannerController.updateGoal)
  .delete(validate({ params: idParamSchema }), plannerController.deleteGoal);

export default router;
