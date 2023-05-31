import { writable } from "svelte/store";

function setStatusForUploads() {
  const { subscribe, set, update } = writable(new Map());

  return {
    subscribe,
    setStatus: (fileName: string, progress: number) =>
      update((status) => status.set(fileName, progress)),
    reset: () => set(new Map()),
  };
}

export const uploadStatus = setStatusForUploads();
