import { Observable } from "rxjs";

export interface DownloadFileOptions {
  mimeType: "text/csv; charset=UTF-8" | "text/calendar; charset=UTF-8" | "application/json; charset=UTF-8";
  filename: string;
}

export function downloadFile(calendarData: string, { mimeType, filename }: DownloadFileOptions): Observable<boolean> {
  return new Observable((subscriber) => {
    const url = URL.createObjectURL(new Blob([calendarData], { endings: "transparent", type: mimeType }));

    chrome.downloads.download({ url, filename }, (downloadId) => {
      if (typeof downloadId === "undefined") {
        return subscriber.error({ message: "FAILED TO DOWNLOAD FILE", error: chrome.runtime.lastError });
      }
      subscriber.next(true);
      subscriber.complete();
    });

    return () => subscriber.complete();
  });
}
