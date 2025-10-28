import imageKit from "../config/ImageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";
// function for create resume
//POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    //create new Resume
    const newResume = await Resume.create({ userId, title });
    //return success message
    res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//function for deleting resume
//DELETE:/api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    //delete Resume
    await Resume.findOneAndDelete({ userId, _id: resumeId });
    //return success message
    res.status(201).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//function to get user by id
//GET: /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });
    if (!resume) {
      return res.status(400).json({ message: "Resume not found" });
    }
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(201).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//function to get public resume
//GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ public: true, _id: resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//function for updating resume
//PUT: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;
    console.log('req.body:', req.body);
console.log('req.file:', req.file);

    let resumeDataCopy;
    if(typeof resumeData === 'string'){
      resumeDataCopy = await JSON.parse(resumeData)
    }else{
      resumeDataCopy = structuredClone(resumeData)
    }

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder:'user-resumes',
        transformation:{
            pre:'w-300, h-300,fo-face,z-0.75'+(removeBackground ? ',e-bgremove': '')
        }
      });
      resumeDataCopy.personal_info.image = response.url;
    }
    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );
    return res.status(200).json({ message: "saved successfully", resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
