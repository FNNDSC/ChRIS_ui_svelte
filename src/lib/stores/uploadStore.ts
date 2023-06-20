import { writable } from "svelte/store";

interface UploadStatus {
  isOpen: boolean;
  fileStatus: {
    [key: string]: {
      progress: number;
      controller: AbortController;
    };
  };
  folderStatus: {
    [key: string]: {
      done: number;
      total: number;
      controller: AbortController;
    };
  };
}

function getInitialStatus(): UploadStatus {
  return {
    isOpen: false,
    fileStatus: {},
    folderStatus: {},
  };
}

function setStatusForUploads() {
  const { subscribe, set, update } = writable(getInitialStatus());

  return {
    subscribe,
    setStatusForFiles: (
      fileName: string,
      progress: number,
      controller: AbortController
    ) => {
      update((status) => {
        return {
          ...status,
          fileStatus: {
            ...status.fileStatus,
            [fileName]: {
              progress,
              controller,
            },
          },
        };
      });
    },
    setStatusForFolders: (
      name: string,
      done: number,
      total: number,
      controller: AbortController
    ) => {
      update((status) => {
        return {
          ...status,
          folderStatus: {
            [name]: {
              done,
              total,
              controller,
            },
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

    clearNotifications: () => {},
    reset: () => set(getInitialStatus()),
  };
}

export const uploadStore = setStatusForUploads();
