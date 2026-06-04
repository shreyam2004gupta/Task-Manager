import Task from "../models/Task.model.js";
import { errorHandler } from "../utils/error.js";

export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todochecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return next(
        errorHandler(400, "assignedTo must be an array of user Ids")
      );
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todochecklist,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "task craeted successfully", task });
  } catch (error) {
    next(error);
  }
};

