import express from "express";
import { noteValidationSchema } from "../../validation/note";
import { Note } from "../../models/notes/note";
import { authenticateToken } from "../../middleware/auth";
import { Response } from "express";
import { User } from "../../models/users/user";

const router = express.Router();

const createNote = async (req: any, res: Response): Promise<any> => {
  const { error } = noteValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details[0].message;
    return res.status(400).json({ success: false, message: errorMessage });
  }
  try {
    const userId = req.user._id;
    const body = {
      ...req.body,
      author: userId,
    };
    const note = new Note(body);
    await note.save();
    res
      .status(200)
      .send({ success: true, message: "Note created successfully!", note });
  } catch (error) {
    res.status(400).send({ success: true, message: error });
  }
};

const getNotes = async (req: any, res: Response): Promise<any> => {
  const { search } = req.query;
  const userId = req.user._id;
  let response;
  if (search && search.trim()) {
    const searchData = await Note.find({
      $or: [
        {
          title: { $regex: search, $options: "i" },
          description: { $regex: search, $options: "i" },
        },
      ],
    });
    response = searchData;
  } else {
    delete req.query.search;
    response = await Note.find({ author: userId }).exec();
  }
  const userInfo = await User.findById({ _id: userId }).exec();
  if (!userInfo?.email) {
    return res.status(400).json({ success: false, message: "No todo found!" });
  }
  const updatedNotes = response.map((note) => {
    return {
      ...note.toObject(),
      author: userInfo.email,
    };
  });

  return res
    .status(200)
    .json({ success: true, message: "Get Notes", notes: updatedNotes });
};

const getNoteById = async (req: any, res: Response): Promise<any> => {
  const noteId = req.params.id;
  const userId = req.user._id;
  const userInfo = await User.findById({ _id: userId }).exec();

  let response = await Note.findOne({ _id: noteId, author: userId });
  const updatedResponse = {
    ...response?.toObject(),
    author: userInfo?.email,
  };
  res
    .status(200)
    .json({ success: true, message: "Get Note by id", note: updatedResponse });
};

const updateNoteById = async (req: any, res: Response): Promise<any> => {
  const userId = req.user._id;
  const noteId = req.params.id;
  const updateNote = req.body;
  const response = await Note.findByIdAndUpdate(
    { _id: noteId, author: userId },
    updateNote,
    { new: true }
  );
  if (!response)
    return res
      .status(400)
      .json({ success: false, message: "Fail to update note" });

  res
    .status(200)
    .json({ success: true, message: "Update Note", note: response });
};

const deleteNoteById = async (req: any, res: Response): Promise<any> => {
  const noteId = req.params.id;
  const userId = req.user._id;
  const response = await Note.findByIdAndDelete({
    _id: noteId,
    author: userId,
  });

  if (!response)
    return res
      .status(400)
      .json({ success: false, message: "Note are not found!" });

  res
    .status(200)
    .json({ success: true, message: "Delete Note", note: response });
};

router.post("/create-note", authenticateToken, createNote);
router.get("/note", authenticateToken, getNotes);
router.get("/note/:id", authenticateToken, getNoteById);
router.patch("/update-note/:id", authenticateToken, updateNoteById);
router.delete("/delete-note/:id", authenticateToken, deleteNoteById);

export default router;
