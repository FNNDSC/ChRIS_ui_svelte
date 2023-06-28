import { writable } from "svelte/store";

interface FolderDownload {
  [key: string]: {
    name: string;
    progress: number;
    currentStep: string;
    cancelled: () => void;
  };
}

interface FileDownload {
  [key: string]: {
    progress: number;
    cancelled: AbortController;
    currentStep: string;
  };
}

export interface DownloadState {
  isOpen: boolean;
  folderDownload: FolderDownload;
  fileDownload: FileDownload;
}

function getInitialStatus(): DownloadState {
  return {
    isOpen: false,
    folderDownload: {},
    fileDownload: {},
  };
}

function setStatusForDownloads() {
  const { subscribe, update } = writable(getInitialStatus());

  return {
    subscribe,

    cancelDownload: (name: string, cancelled: () => void) => {
      update((status) => {
        return {
          ...status,
          folderDownload: {
            ...status.folderDownload,
            [name]: {
              ...status.folderDownload[name],
              cancelled,
            },
          },
        };
      });
    },

    setLargeFileDownload: (
      name: string,
      progress: number,
      currentStep: string,
      cancelled: AbortController
    ) => {
      update((status) => {
        return {
          ...status,
          fileDownload: {
            ...status.fileDownload,
            [name]: {
              progress,
              cancelled,
              currentStep,
            },
          },
        };
      });
    },

    setNewNotification: () => {
      update((status) => {
        return {
          ...status,
          isOpen: true,
        };
      });
    },
    setFolderStep: (name: string, step: string) => {
      update((status) => {
        return {
          ...status,
          folderDownload: {
            ...status.folderDownload,
            [name]: {
              ...status.folderDownload[name],
              currentStep: step,
            },
          },
        };
      });
    },
    setFolderProgress: (name: string, progress: number) => {
      update((status) => {
        return {
          ...status,
          folderDownload: {
            ...status.folderDownload,
            [name]: {
              ...status.folderDownload[name],
              progress,
            },
          },
        };
      });
    },

    closeNotification: () => {
      update((status) => {
        deleteCompletedFileNotifications(status.fileDownload);
        deleteCompletedFolderNotifications(status.folderDownload);

        return {
          ...status,
          isOpen: false,
        };
      });
    },
  };
}

function deleteCompletedFileNotifications(fileDownload: FileDownload) {
  for (const step in fileDownload) {
    const currentStep = fileDownload[step].currentStep;

    if (
      currentStep === "Download Complete" ||
      currentStep === "Download Cancelled"
    ) {
      delete fileDownload[step];
    } else fileDownload[step];
  }
}

function deleteCompletedFolderNotifications(folderDownload: FolderDownload) {
  for (const step in folderDownload) {
    const currentStep = folderDownload[step].currentStep;

    if (
      currentStep === "Download Complete" ||
      currentStep === "Download Cancelled"
    ) {
      delete folderDownload[step];
    } else folderDownload[step];
  }
}

export const downloadStore = setStatusForDownloads();
