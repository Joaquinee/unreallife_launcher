<template>
  <div class="flex flex-col items-center justify-center h-full font-typoldRegular tracking-tight p-10">
    <div class="flex flex-col items-center justify-center mb-8">
      <img src="../images/icon.png" alt="Description de l'image" class="mb-4" />

      <p class="text-red-800 mb-2">
        Cette fonctionnalité n'est pas encore disponible.
      </p>
      <p id = "version"></p>
      <button id="compareAndUpdateButton" @click="compareAndUpdate" :disabled="isButtonDisabled" className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
        {{ isButtonDisabled ? 'Vérification en cours ...' : 'Jouer' }}
      </button>

      <p id= "nombre" class="mt-4"></p>
      <p id ="name">En téléchargement : </p>
      <p>Pourcentage de téléchargement : {{ formatPercentage(downloadProgressPercent) }} </p>

      <div class="flex flex-wrap p-4">
      
    </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isButtonDisabled = ref(true);
const isReady = ref(false);

const downloadProgressPercent = ref(0);




onMounted(() => {


  window.ipcRenderer.receive('download-progress', (progress) => {
    downloadProgressPercent.value = progress;
  });
  window.ipcRenderer.receive('app-ready', (ready) => {
    if (ready) {
      isReady.value = true;
      isButtonDisabled.value = false;  // Activer le bouton si l'application est prête
    }
  });

  window.ipcRenderer.receive('download-name', (name) => {
    document.getElementById("name").innerHTML = name;
  });
});
const formatPercentage = (percentage) => {
  // Formater le pourcentage avec deux décimales
  return (percentage * 100).toFixed(2) + '%';
};

const compareAndUpdate = async () => {
  if (!isReady) return;

  try {
    const addonsToUpdate = await window.a3url.getCompareData();
    const nombre = addonsToUpdate.length;
    if (nombre > 0) {
      isButtonDisabled.value = true;
      return;
    }
    document.getElementById("nombre").innerHTML = `Ils vous manquent ${nombre} addons`;
    let nbr = nombre;
 
   
    for (const element of addonsToUpdate) {
      await window.a3url.dowloadMods(element.name);
      nbr--;
      document.getElementById("nombre").innerHTML = `Ils vous manquent ${nbr} addons`;
    }
    await window.a3url.setNewClientjson();

    
  } catch (error) {
    console.error('Erreur lors de la comparaison et de la mise à jour :', error);
  } finally {
    
    document.getElementById("name").innerHTML = "";
    document.getElementById("nombre").innerHTML = `Tous vos addons sont à jour`;
    isButtonDisabled.value = false;
  }
};
</script>

