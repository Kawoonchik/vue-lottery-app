<script setup lang="ts"></script>

<template>
  <div class="bg-white p-8 rounded shadow-sm border border-gray-200">
    <h1 class="text-3xl font-bold mb-4 text-gray-800">Welcome to Lottery App</h1>
    <p class="text-gray-600 mb-6 leading-relaxed">
      This is a Single Page Application (SPA) built for managing a lottery system. It demonstrates
      modern frontend architecture using Vue Router for navigation, Pinia for state management, and
      the Repository pattern for API integration.
    </p>

    <h2 class="text-xl font-bold mb-3 text-gray-700">Technologies Used:</h2>
    <ul class="list-disc list-inside text-gray-600 mb-6 space-y-2">
      <li><strong>Vue 3</strong> (Composition API) & <strong>TypeScript</strong></li>
      <li><strong>Vue Router</strong> (Lazy loading, Navigation Guards, Meta Layouts)</li>
      <li><strong>Pinia</strong> (Global State & JWT Authentication)</li>
      <li><strong>TailwindCSS</strong> & <strong>SCSS</strong> for styling</li>
      <li><strong>VeeValidate</strong> & <strong>Yup</strong> for form validation</li>
    </ul>

    <a
      href="https://github.com/Kawoonchik/vue-lottery-app.git"
      target="_blank"
      class="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
    >
      View Project on GitHub →
    </a>
  </div>
</template>
