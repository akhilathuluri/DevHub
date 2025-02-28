import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserData } from "./githubApi";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generatePortfolioContent = async (githubUsername: string) => {
  try {
    const githubData = await getUserData(githubUsername);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a professional portfolio website content based on this GitHub profile data:
    Name: ${githubData.name}
    Bio: ${githubData.bio}
    Repositories: ${JSON.stringify(githubData.repositories)}
    Languages: ${JSON.stringify(githubData.languages)}
    Contributions: ${githubData.contributions}
    
    Return a JSON object with the following structure:
    {
      "hero": {
        "headline": "string",
        "subheadline": "string"
      },
      "about": {
        "introduction": "string",
        "expertise": ["string"],
        "keySkills": ["string"]
      },
      "projects": [{
        "name": "string",
        "description": "string",
        "highlights": ["string"],
        "technologies": ["string"]
      }],
      "achievements": ["string"],
      "contact": {
        "tagline": "string",
        "availability": "string"
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json\s*|\s*```/g, '').trim();
    
    return {
      ...JSON.parse(jsonStr),
      github: {
        username: githubUsername,
        avatarUrl: githubData.avatarUrl,
        profileUrl: `https://github.com/${githubUsername}`,
        stats: {
          repositories: githubData.repositories.length,
          contributions: githubData.contributions,
          languages: githubData.languages
        }
      }
    };
  } catch (error) {
    console.error('Error generating portfolio content:', error);
    throw error;
  }
};

export const generateSourceCode = (portfolioData: any) => {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioData.github.username} - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
</head>
<body>
    <!-- Portfolio Content -->
    ${generateHTMLContent(portfolioData)}
    <script>
      AOS.init();
    </script>
</body>
</html>`;

  const files = {
    'index.html': htmlTemplate,
    'README.md': generateReadme(portfolioData),
    'styles.css': generateStyles(),
  };

  return files;
};

function generateHTMLContent(data: any) {
  return `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <img
            src="${data.github.avatarUrl}"
            alt="${data.github.username}"
            class="w-48 h-48 rounded-full border-4 border-white shadow-lg"
            data-aos="zoom-in"
          />
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
              ${data.hero.headline}
            </h1>
            <p class="text-xl text-indigo-100" data-aos="fade-up" data-aos-delay="200">
              ${data.hero.subheadline}
            </p>
            <div class="flex gap-4 mt-6" data-aos="fade-up" data-aos-delay="400">
              <a
                href="${data.github.profileUrl}"
                target="_blank"
                class="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View GitHub Profile
              </a>
              <button class="px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-indigo-600 transition-colors">
                Contact Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 class="text-3xl font-bold mb-6">About Me</h2>
            <p class="text-gray-600 mb-6">${data.about.introduction}</p>
            <div class="space-y-4">
              ${data.about.expertise.map((item: string, index: number) => `
                <div class="flex items-center space-x-2" data-aos="fade-right" data-aos-delay="${index * 100}">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span>${item}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div>
            <h3 class="text-2xl font-bold mb-6">Technical Skills</h3>
            <div class="grid grid-cols-2 gap-4">
              ${data.about.keySkills.map((skill: string, index: number) => `
                <div class="bg-gray-50 p-4 rounded-lg" data-aos="zoom-in" data-aos-delay="${index * 100}">
                  <svg class="w-5 h-5 text-indigo-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span class="font-medium">${skill}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${data.projects.map((project: any, index: number) => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden" data-aos="fade-up" data-aos-delay="${index * 200}">
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2">${project.name}</h3>
                <p class="text-gray-600 mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                  ${project.technologies.map((tech: string) => `
                    <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">${tech}</span>
                  `).join('')}
                </div>
                <ul class="space-y-2">
                  ${project.highlights.map((highlight: string) => `
                    <li class="flex items-start">
                      <svg class="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span class="text-sm text-gray-600">${highlight}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div data-aos="fade-up">
          <h2 class="text-3xl font-bold mb-4">Let's Connect</h2>
          <p class="text-xl text-gray-600 mb-8">${data.contact.tagline}</p>
          <p class="text-indigo-600 font-medium mb-8">${data.contact.availability}</p>
          <div class="flex justify-center gap-4">
            <a
              href="${data.github.profileUrl}"
              target="_blank"
              class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Profile
            </a>
            <button class="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </section>`;
}

function generateReadme(data: any) {
  return `# ${data.github.username}'s Portfolio

## Overview
This portfolio website was generated using GitHub Profile data and AI.

## Setup
1. Clone this repository
2. Open index.html in your browser
3. Customize the content as needed

## Technologies Used
- HTML5
- TailwindCSS
- AOS (Animate On Scroll)

## Customization
Feel free to modify the styles and content to match your preferences.`;
}

function generateStyles() {
  return `
/* Custom styles can be added here */
.custom-gradient {
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
}`;
}
