import { defineConfig } from 'vite';


// https://vitejs.dev/config
export default defineConfig({
 
  publicDir: 'src/html',
  // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
  // If you are familiar with Vite configuration, it will look really familiar.
  resolve: {
   
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    mainFields: ['module', 'jsnext:main', 'jsnext'],
   

  },
  optimizeDeps: { 
    include: ['electron']
  },

});
