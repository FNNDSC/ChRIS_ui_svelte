import { writable } from "svelte/store";

function setStatusForUploads() {
  const { subscribe, set, update } = writable({
    isOpen: false,
    uploadStatusForFiles: new Map(),
    uploadStatusForFolders: {
      total: 0,
      done: 0,
      name: "",
    },
  });

  return {
    subscribe,
    setStatusForFiles: (fileName: string, progress: number) =>
      update((status) => {
        return {
          ...status,
          uploadStatus: status.uploadStatusForFiles.set(fileName, progress),
        };
      }),

    setFolderDetails: (total: number, name: string) =>
      update((status) => {
        return {
          ...status,
          uploadStatusForFolders: {
            ...status.uploadStatusForFolders,
            name,
            total,
          },
        };
      }),

    setStatusForFolders: (done: number) => {
      update((status) => {
        return {
          ...status,
          uploadStatusForFolders: {
            ...status.uploadStatusForFolders,
            done,
          },
        };
      });
    },
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
        uploadStatusForFolders: {
          total: 0,
          done: 0,
          name: "",
        },
        uploadStatusForFiles: new Map(),
      }),
  };
}

export const uploadStore = setStatusForUploads();
