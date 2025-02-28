import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, RefreshCw, Github, Award, Code, Star } from 'lucide-react';
import { getUserData } from '../services/githubApi';
import { generateResumeContent } from '../services/geminiApi';
import { PDFDocument, rgb } from 'pdf-lib';
import html2canvas from 'html2canvas';

const ResumeGenerator = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState<any>(null);

  const handleGenerateResume = async () => {
    if (!username) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const githubData = await getUserData(username);
      const generatedContent = await generateResumeContent(githubData);
      setResumeData(generatedContent);
    } catch (error: any) {
      setError(error.message || 'Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const resumeElement = document.getElementById('resume-content');
      if (!resumeElement) return;

      const canvas = await html2canvas(resumeElement);
      const imgData = canvas.toDataURL('image/png');

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const pngImage = await pdfDoc.embedPng(imgData);

      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${username}-github-resume.pdf`;
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          GitHub Resume Generator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create a professional resume from your GitHub profile using AI
        </p>
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <div className="max-w-xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter GitHub username"
                />
                <Github className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleGenerateResume}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-red-600 text-sm">{error}</p>
          )}
        </div>
      </motion.div>

      {/* Resume Content */}
      <AnimatePresence>
        {resumeData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-8"
            id="resume-content"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-end mb-4">
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Professional Summary */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Professional Summary</h2>
                  <p className="text-gray-700">{resumeData.professionalSummary}</p>
                </section>

                {/* Technical Skills */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Technical Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.technicalSkills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Project Highlights */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Project Highlights</h2>
                  <div className="space-y-4">
                    {resumeData.projectHighlights.map((project: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-gray-600">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Contributions and Achievements */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Contributions & Achievements</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {resumeData.contributionsAndAchievements.map((item: string, index: number) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </section>

                {/* Recommendations */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">AI-Generated Recommendations</h2>
                  <div className="italic text-gray-600">{resumeData.recommendations}</div>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeGenerator;
