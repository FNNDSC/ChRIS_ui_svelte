import { writable } from "svelte/store";

interface UploadStatus {
  isOpen: boolean;
  fileUpload: {
    [key: string]: {
      currentStep: string;
      progress: number;
      controller: AbortController;
    };
  };
  folderUpload: {
    [key: string]: {
      currentStep: string;
      done: number;
      total: number;
      controller: AbortController;
    };
  };
}

function getInitialStatus(): UploadStatus {
  return {
    isOpen: false,
    fileUpload: {},
    folderUpload: {},
  };
}

function setStatusForUploads() {
  const { subscribe, set, update } = writable(getInitialStatus());

  return {
    subscribe,
    setStatusForFiles: (
      currentStep: string,
      fileName: string,
      progress: number,
      controller: AbortController
    ) => {
      update((status) => {
        return {
          ...status,
          fileUpload: {
            ...status.fileUpload,
            [fileName]: {
              currentStep,
              progress,
              controller,
            },
          },
        };
      });
    },
    setStatusForFolders: (
      currentStep: string,
      name: string,
      done: number,
      total: number,
      controller: AbortController
    ) => {
      update((status) => {
        return {
          ...status,
          folderUpload: {
            [name]: {
              currentStep,
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
