import { writable } from "svelte/store";

function getInitialStatus() {
  return {
    isOpen: false,
    fileStatus: new Map(),
    folderStatus: {
      total: 0,
      done: 0,
      name: "",
    },
  };
}

function setStatusForUploads() {
  const { subscribe, set, update } = writable(getInitialStatus());

  return {
    subscribe,
    setStatusForFiles: (fileName: string, progress: number) =>
      update((status) => {
        return {
          ...status,
          fileStatus: status.fileStatus.set(fileName, progress),
        };
      }),

    setFolderDetails: (total: number, name: string) =>
      update((status) => {
        return {
          ...status,
          folderStatus: {
            ...status.folderStatus,
            name,
            total,
          },
        };
      }),

    setStatusForFolders: (done: number) => {
      update((status) => {
        return {
          ...status,
          folderStatus: {
            ...status.folderStatus,
            done,
          },
        };
      });
    },

    newNotification: () => {
      update((status) => {
        return {
          ...status,
          isOpen: true,
        };
      });
    },
    toggleNotification: () => {
      update((status) => {
        return {
          ...status,
          isOpen: !status.isOpen,
        };
      });
    },
    reset: () => set(getInitialStatus()),
  };
}

export const uploadStore = setStatusForUploads();
