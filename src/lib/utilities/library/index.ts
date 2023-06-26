import axios from "axios";
import { invalidateAll, invalidate } from "$app/navigation";
import { downloadStore } from "$lib/stores/downloadStore";
import { uploadStore } from "$lib/stores/uploadStore";
import { fetchClient } from "$lib/client";
import type { AxiosProgressEvent } from "axios";

export function download(blob: Blob, name: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.target = "_blank";
  link.href = url;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

async function clientSetup(token: string) {
  const client = fetchClient(token);
  await client.setUrls();
  return client;
}

export function getFileName(fname: string) {
  const fileNameArray = fname.split("/");
  const fileName = fileNameArray[fileNameArray.length - 1];
  return fileName;
}

export async function handleFileDownload(file: any, token: string) {
  const client = await clientSetup(token);
  const fetchedFileList = await client.getUploadedFiles({
    fname: file.fname,
  });
  const fetchedFile = fetchedFileList.getItems() as any;

  const fileData = fetchedFile[0];
  const fileSize = fileData.data.fsize;
  const fileName = getFileName(fileData.data.fname);

  if (fileSize > 1000000000) {
    downloadStore.setNewNotification();
    const url = `${fileData.url}${fileName}`;
    const controller = new AbortController();

    downloadStore.setLargeFileDownload(
      fileName,
      0,
      "Preparing to Download",
      controller
    );

    try {
      const response = await axios.get(url, {
        responseType: "blob",
        headers: {
          Authorization: `Token ${token}`,
        },
        signal: controller.signal,
        onDownloadProgress: (progressEvent) => {
          const progress = Math.floor((progressEvent.loaded / fileSize) * 100);
          downloadStore.setLargeFileDownload(
            fileName,
            progress,
            "Downloading",
            controller
          );

          if (progress === 100) {
            downloadStore.setLargeFileDownload(
              fileName,
              progress,
              "Download Complete",
              controller
            );
          }
        },
      });

      if (response && response.data) {
        const blob = new Blob([response.data]);
        download(blob, fileName);
      }
    } catch (error) {
      downloadStore.setLargeFileDownload(
        fileName,
        0,
        "Download Cancelled",
        controller
      );
    }
  } else {
    const blob = await fetchedFile[0].getFileBlob();
    download(blob, fileName);
  }
}

export async function handleFolderDownload(folder: any, token: string) {
  downloadStore.setNewNotification();
  downloadStore.setFolderStep(folder.name, "Preparing to zip");

  const client = await clientSetup(token);
  const dircopyPlugin = await client.getPlugins({
    name: "pl-dircopy",
  });

  const dircopyList = dircopyPlugin.getItems() as any;

  if (!dircopyList) {
    downloadStore.setFolderStep(folder.name, "Download Failed");
  }

  const dircopy = dircopyList[0];

  const dircopyParams = {
    dir: folder.path,
    previous_id: 0,
    title: `${folder.name}.zip`,
  };

  const dircopyPluginInstance = await client.createPluginInstance(
    dircopy.data.id,
    dircopyParams
  );

  if (!dircopyPluginInstance) {
    downloadStore.setFolderStep(folder.name, "Download Failed");
  }

  const cancelledDircopy = function cancelled() {
    dircopyPluginInstance.put({
      status: "cancelled",
    });
    downloadStore.setFolderStep(folder.name, "Download Cancelled");
  };

  downloadStore.cancelDownload(folder.name, cancelledDircopy);
  downloadStore.setFolderStep(folder.name, "Zipping Files");

  const zipPluginArgs = {
    title: "zip_files",
    previous_id: dircopyPluginInstance.data.id,
    inputFile: "input.meta.json",
    noJobLogging: true,
    exec: "zip -r %outputDir/parent.zip %inputDir",
  };

  const zipPluginList: any = await client.getPlugins({
    name_exact: "pl-pfdorun",
  });

  if (!zipPluginList || !zipPluginList.data) {
    downloadStore.setFolderStep(folder.name, "Download Failed");
  }

  const zipPluginInstance = await client.createPluginInstance(
    zipPluginList.data[0].id,
    zipPluginArgs
  );

  if (!zipPluginInstance) {
    downloadStore.setFolderStep(folder.name, "Download Failed");
  }

  const cancelledZip = function cancelled() {
    zipPluginInstance.put({
      status: "cancelled",
    });
    downloadStore.setFolderStep(folder.name, "Download Cancelled");
  };

  downloadStore.cancelDownload(folder.name, cancelledZip);

  let status = "started";

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  do {
    await delay(5000);
    const details = await zipPluginInstance.get();
    status = details.data.status;
  } while (
    !["finishedSuccessfully", "cancelled", "finishedWithError"].includes(status)
  );

  downloadStore.setFolderStep(folder.name, "Zip Complete");

  const filesList = await zipPluginInstance.getFiles({
    limit: 10,
  });

  const files = filesList.getItems();

  if (
    files?.length === 0 ||
    ["cancelled", "finishedWithError"].includes(status)
  ) {
    downloadStore.setFolderStep(folder.name, "Download Cancelled");
  } else {
    downloadStore.setFolderStep(folder.name, "Preparing to Download");

    //@ts-ignore
    const file = files[0];

    const fileName = getFileName(file.data.fname);
    const url = `${file.url}/${fileName}`;

    const controller = new AbortController();

    try {
      const response = await axios.get(url, {
        responseType: "blob",
        headers: {
          Authorization: `Token ${token}`,
        },
        signal: controller.signal,
        onDownloadProgress: (progressEvent) => {
          const progress = Math.floor(
            (progressEvent.loaded / file.data.fsize) * 100
          );
          downloadStore.cancelDownload(folder.name, controller.abort);
          downloadStore.setFolderProgress(folder.name, progress);

          if (progress === 100) {
            downloadStore.setFolderStep(folder.name, "Download Complete");
          }
        },
      });

      if (response && response.data) {
        const blob = new Blob([response.data]);
        download(blob, fileName);
      }
    } catch (error) {
      downloadStore.setFolderStep(folder.name, "Download Failed");
    }
  }
}

export async function handleUpload(
  files: FileList,
  isFolder: boolean,
  currentPath: string,
  token: string
) {
  const items = Array.from(files);
  const client = await clientSetup(token);
  const url = client.uploadedFilesUrl;

  uploadStore.newNotification();

  let count = 0;
  items.map(async (file) => {
    const formData = new FormData();
    const name = isFolder ? file.webkitRelativePath : file.name;
    formData.append("upload_path", `${currentPath}/${name}`);
    formData.append("fname", file, file.name);
    const controller = new AbortController();

    try {
      const config = {
        headers: { Authorization: "Token " + token },
        signal: controller.signal,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent && progressEvent.progress) {
            const progress = Math.round(progressEvent.progress * 100);

            if (!isFolder) {
              uploadStore.setStatusForFiles(
                "Uploading",
                file.name,
                progress,
                controller
              );

              if (progress === 100) {
                uploadStore.setStatusForFiles(
                  "Upload Complete",
                  file.name,
                  progress,
                  controller
                );
              }
            } else {
              if (progress === 100) {
                count++;
                const fileName = files[0].webkitRelativePath.split("/")[0];
                uploadStore.setStatusForFolders(
                  "Uploading",
                  fileName,
                  count,
                  files.length,
                  controller
                );

                if (count === files.length) {
                  uploadStore.setStatusForFolders(
                    "Upload Complete",
                    fileName,
                    count,
                    files.length,
                    controller
                  );
                }
              }
            }
          }
        },
      };
      await axios.post(url, formData, config);
      invalidate("app:reload");
    } catch (error: any) {
      return;
    }
  });
}

export async function createNewFolder(
  newFolder: string,
  currentPath: string,
  token: string
) {
  const client = await clientSetup(token);

  if (!newFolder) {
    newFolder = "Untitled";
  }

  const content = "Welcome";
  const file = new Blob([content], { type: "text/plain" });
  const path = `${currentPath}/${newFolder}`;
  const formData = new FormData();
  formData.append("upload_path", `${path}/Welcome.txt`);
  formData.append("fname", file, "Welcome.txt");

  try {
    const config = {
      headers: { Authorization: "Token " + token },
    };
    await axios.post(client.uploadedFilesUrl, formData, config);
    
    invalidate("app:reload");
  } catch (error) {
    console.log("Error", error);
  }
}
