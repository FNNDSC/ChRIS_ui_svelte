import { writable } from "svelte/store";

interface FolderUpload {
  [key: string]: {
    currentStep: string;
    done: number;
    total: number;
    controller: AbortController;
  };
}

interface FileUpload {
  [key: string]: {
    currentStep: string;
    progress: number;
    controller: AbortController;
  };
}

interface UploadStatus {
  isOpen: boolean;
  fileUpload: FileUpload;
  folderUpload: FolderUpload;
}

function getInitialStatus(): UploadStatus {
  return {
    isOpen: false,
    fileUpload: {},
    folderUpload: {},
  };
}

function setStatusForUploads() {
  const { subscribe, update } = writable(getInitialStatus());

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
    setNewNotification: () => {
      update((status) => {
        return {
          ...status,
          isOpen: true,
        };
      });
    },

    closeNotification: () => {
      update((status) => {
        deleteCompletedFileNotifications(status.fileUpload);
        deleteCompletedFolderNotifications(status.folderUpload);
        return {
          ...status,
          isOpen: false,
        };
      });
    },
  };
}

function deleteCompletedFileNotifications(fileUpload: FileUpload) {
  for (const step in fileUpload) {
    const currentStep = fileUpload[step].currentStep;
    if (
      currentStep === "Upload Complete" ||
      currentStep === "Upload Cancelled"
    ) {
      delete fileUpload[step];
    } else fileUpload[step];
  }
}

function deleteCompletedFolderNotifications(folderUpload: FolderUpload) {
  for (const step in folderUpload) {
    const currentStep = folderUpload[step].currentStep;

    if (
      currentStep === "Upload Complete" ||
      currentStep === "Upload Cancelled"
    ) {
      delete folderUpload[step];
    } else folderUpload[step];
  }
}

export const uploadStore = setStatusForUploads();
