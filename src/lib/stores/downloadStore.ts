import { writable } from "svelte/store";


function getInitialStatus(){
  return {
    isOpen: false,
  };
}

function setStatusForDownloads() {
  const { subscribe, set, update } = writable(getInitialStatus());

  return {
    subscribe,
  };
}

export const downloadStore = setStatusForDownloads();
