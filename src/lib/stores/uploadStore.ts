import { writable } from "svelte/store";

function setStatusForUploads() {
  const { subscribe, set, update } = writable({
    isOpen: false,
    uploadStatus: new Map(),
  });

  return {
    subscribe,
    setStatus: (fileName: string, progress: number) =>
      update((status) => {
        return {
          ...status,
          uploadStatus: status.uploadStatus.set(fileName, progress),
        };
      }),
    showNotifiction: () => {
      update((status) => {
        return {
          ...status,
          isOpen: !status.isOpen,
        };
      });
    },
    reset: () =>
      set({
        isOpen: false,
        uploadStatus: new Map(),
      }),
  };
}

export const uploadStore = setStatusForUploads();
