<template>
  

  <div class="flex flex-col items-center justify-center h-full font-typoldRegular tracking-tight p-10">
        <div class="flex flex-col items-center justify-center mb-8">
            <button id="compareAndUpdateButton" @click="compareAndUpdate" :disabled="isButtonDisabled" className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
               {{ isButtonDisabled ? 'Vérification en cours ...' : 'Jouer' }}
            </button>
            
        </div>
        <button  @click="installTFR"  className="p-2 btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-red active:bg-red-800">
            Installer TFR
          </button>
  </div>
  <p id= "nombre" class="mt-2"></p>
  <p id ="name" class="mt-2"></p>
  <div v-if="isDown">
  
    <div :class="'inline-block mb-2 ms-[calc('+formatBar(downloadProgressPercent)+'-1.25rem)] py-0.5 px-1.5 bg-blue-50 border border-blue-200 text-xs font-medium text-blue-600 rounded-lg dark:bg-blue-800/30 dark:border-blue-800 dark:text-blue-500'">{{ formatBar(downloadProgressPercent) }}</div>
      <div class="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700" role="progressbar" :aria-valuenow="simpleFormat(downloadProgressPercent)" aria-valuemin="0" aria-valuemax="100">
        <div class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" :style="{ width: formatPercentage(downloadProgressPercent) }"></div>
    </div>
    
  </div>


          
  
 

</template>

<script setup>
import { ref, onMounted } from 'vue';
const isButtonDisabled = ref(true);
const launcharman = ref(false);
const isReady = ref(false);
const downloadProgressPercent = ref(0);
const isDown = ref(false);

onMounted(() => {
  window.ipcRenderer.receive('getVersion', (version) => {
    document.getElementById("version").innerHTML = version;
  });
  window.ipcRenderer.receive('download-progress', (progress) => {
    downloadProgressPercent.value = progress;
  });
  window.ipcRenderer.receive('download-stop', (stpdwn) => {
    isDown.value = stpdwn;
  });
  window.ipcRenderer.receive('isdownload', (rdy) => {
    isDown.value = rdy;
  });
  window.ipcRenderer.receive('app-ready', (rdy) => {
    if (rdy) {
      isReady.value = true;
      isButtonDisabled.value = false;
    }
  });
  window.ipcRenderer.receive('download-name', (name) => {
    document.getElementById("name").innerHTML = "En téléchargement : " + name;
  });
});
const formatPercentage = (percentage) => {
  // Formater le pourcentage avec deux décimales
  return (percentage * 100).toFixed(2) + '%';
};
const formatBar = (percentage) => {
  // Formater le pourcentage avec deux décimales
  return (percentage * 100).toFixed(0) + '%';
};
const simpleFormat = (percentage) => {
  // Formater le pourcentage avec deux décimales
  return (percentage * 100).toFixed(0);
};

const installTFR = async () => {
    await window.a3url.tfar();
}

const compareAndUpdate = async () => {
  if (!isReady.value) return;


  if (launcharman.value) {

    document.getElementById("nombre").innerHTML = `Lancement du jeu ...`;
    await window.a3url.launcGame();

  } else {
    try {
      const addonsToUpdate = await window.a3url.getCompareData();
      const nombre = addonsToUpdate.length;
      
      if (nombre == 0) {
        isButtonDisabled.value = false;
        document.getElementById("nombre").innerHTML = `Lancement du jeu ...`;
        await window.a3url.launcGame();

      } else {
        isButtonDisabled.value = true;
        document.getElementById("nombre").innerHTML = `Ils vous manquent : ${nombre} addons`;
        let nbr = nombre;
        for (const element of addonsToUpdate) {
          await window.a3url.dowloadMods(element.name);
          nbr--;
          document.getElementById("nombre").innerHTML = `Ils vous manquent : ${nbr} addons`;
        }
        await window.a3url.setNewClientjson(); 
        document.getElementById("name").innerHTML = "";
        document.getElementById("nombre").innerHTML = `Tous vos addons sont à jour`;   
        launcharman.value = true;
        isButtonDisabled.value = false;
      }
      
    } catch (error) {
      console.error('Erreur lors de la comparaison et de la mise à jour :', error);
    }
  }
 
};
</script>

