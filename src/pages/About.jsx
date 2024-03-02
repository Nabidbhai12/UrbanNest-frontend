import React from 'react';

export default function About() {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Hafijul Hoque</h1>
        <p className="text-lg text-gray-600">
          Dedicated and passionate professional with a focus on [Your Specialty]. With years of experience in [Your Industry], I bring a wealth of knowledge and skills to every project.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-3">My Mission</h2>
        <p className="text-gray-600 mb-6">
          To provide exceptional service and innovative solutions in [Your Field], constantly striving to exceed expectations and drive positive change.
        </p>

        <h2 className="text-3xl font-semibold text-gray-700 mb-3">My Skills</h2>
        <p className="text-gray-600">
          A brief overview of your skills, such as Web Development, Design, Project Management, etc. Detail your proficiency in specific technologies or methodologies.
        </p>
        {/* Add more content as needed */}
      </div>
    </div>
  );
}
