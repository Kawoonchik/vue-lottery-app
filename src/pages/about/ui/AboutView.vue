<script setup lang="ts"></script>

<template>
  <div class="bg-white p-8 rounded shadow-sm border border-gray-200">
    <h1 class="text-3xl font-bold mb-1 text-gray-800">Анатолій Сидор</h1>
    <p class="text-gray-500 mb-8 font-medium">Software Engineering Student</p>

    <h2 class="text-xl font-bold mb-4 text-gray-700">Technical Skills:</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div>
        <h3 class="font-semibold text-gray-800 mb-2">Frontend & Design</h3>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>Vue 3, JavaScript, TypeScript</li>
          <li>TailwindCSS, HTML/CSS</li>
          <li>UX/UI Design (Figma, FigJam)</li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-gray-800 mb-2">Backend & Databases</h3>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>Java (Spring Boot), C#, C++</li>
          <li>Python, Node.js</li>
          <li>MySQL, PostgreSQL, MongoDB</li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-gray-800 mb-2">Tools & DevOps</h3>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>Git, GitHub, GitLab</li>
          <li>Docker, WSL, Linux</li>
          <li>Cisco Packet Tracer, OpenSSL</li>
        </ul>
      </div>
    </div>

    <a
      href="https://github.com/Kawoonchik"
      target="_blank"
      class="inline-block text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
    >
      My GitHub Profile →
    </a>
  </div>
</template>
