import imageKit from "../config/ImageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";
import ai from "../config/ai.js";

import { generateResumeText } from "../utils/generateResumeText.js";
// function for create resume
//POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const emptyResumeData = {
      title,
      professional_summary: "",
      skills: [],
      personal_info: {},
      experience: [],
      project: [],
      education: []
    };

    emptyResumeData.resumeText = generateResumeText(emptyResumeData);

    const newResume = await Resume.create({
      userId,
      ...emptyResumeData
    });

    res.status(201).json({
      message: "Resume created successfully",
      resume: newResume
    });

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

    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    // Handle Image Upload
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300, h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : "")
        },
      });

      resumeDataCopy.personal_info.image = response.url;
    }

    // 🔹 generate resumeText from final resumeData
    resumeDataCopy.resumeText = generateResumeText(resumeDataCopy);

    // Save to DB
    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );

    return res.status(200).json({
      message: "saved successfully",
      resume
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
// Analyze Resume
export const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumeText = resume.resumeText?.trim();
    if (!resumeText) {
      return res.status(400).json({ message: "Resume is empty. Fill in details before analysis." });
    }

    console.log("Resume Text for AI:", resumeText);

    const prompt = `You are a professional resume expert. Analyze this resume and provide a structured JSON response.

IMPORTANT: Return ONLY valid JSON, no markdown, no extra text, no code blocks.

Analyze in exactly 3 sections with scores out of 100:

{
  "overallScore": 85,
  "sections": [
    {
      "name": "Content & Impact",
      "score": 80,
      "color": "blue",
      "topStrength": "One line highlighting best aspect",
      "topImprovement": "One specific actionable suggestion",
      "keywords": ["skill1", "skill2", "skill3"]
    },
    {
      "name": "ATS Optimization",
      "score": 75,
      "color": "purple",
      "topStrength": "One line highlighting best aspect",
      "topImprovement": "One specific actionable suggestion",
      "keywords": ["keyword1", "keyword2"]
    },
    {
      "name": "Professional Presentation",
      "score": 90,
      "color": "green",
      "topStrength": "One line highlighting best aspect",
      "topImprovement": "One specific actionable suggestion",
      "keywords": []
    }
  ],
  "criticalIssues": [
    "Most important issue (max 3 items, each one short line)"
  ],
  "quickWins": [
    "Easy improvement that adds value (max 3 items, each one short line)"
  ],
  "summary": "One sentence overall assessment"
}

SCORING GUIDE:
- 90-100: Excellent, hire-ready
- 75-89: Strong, minor improvements needed
- 60-74: Good foundation, needs work
- Below 60: Significant improvements required

Keep each string to ONE line, maximum 100 characters. Be specific and actionable.

Resume Text:
${resumeText}`;

    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const aiOutput = completion?.choices?.[0]?.message?.content || completion?.output_text;
    if (!aiOutput) {
      return res.status(500).json({ message: "AI did not return any data." });
    }

    let analysis;
    try {
      // Clean any markdown formatting
      let cleanOutput = aiOutput.trim();
      
      // Remove code blocks
      cleanOutput = cleanOutput.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Remove any leading/trailing whitespace
      cleanOutput = cleanOutput.trim();
      
      analysis = JSON.parse(cleanOutput);
    } catch (err) {
      console.error("Failed to parse AI response:", aiOutput);
      return res.status(500).json({ 
        message: "Failed to parse AI response.",
        debug: aiOutput 
      });
    }

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("Analyze Resume Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};