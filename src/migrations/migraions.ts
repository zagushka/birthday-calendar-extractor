import { of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { updateBadge } from "@/libs/badge";
import { UPGRADE_TO_3_1_0 } from "@/migrations/migration.3.1.0";
import { UPGRADE_TO_3_1_3 } from "@/migrations/migration.3.1.3";

export function migrations(details: chrome.runtime.InstalledDetails) {
  if (details.reason !== "update") {
    return;
  }
  // const thisVersion = chrome.runtime.getManifest().version;
  // Open a new page with changes for everyone upgrading from version 2 to 3

  // Update from 2 any version of 3
  if (details.previousVersion < "3") {
    chrome.tabs.create({ url: "static/update-from-2.html" });
  }
  // Update from any previous version of 3 before 3.1.0 (birthdays not stored as ordinals of 2020 anymore)
  // Get birthdays
  of(true)
    .pipe(
      switchMap(() => UPGRADE_TO_3_1_0(details.previousVersion)),
      switchMap(() => UPGRADE_TO_3_1_3(details.previousVersion)),
    )
    .subscribe(() => {
      updateBadge();
    });
}
