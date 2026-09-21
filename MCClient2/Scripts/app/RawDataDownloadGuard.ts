namespace RawDataDownloadGuard {
    export const DefaultWarningAfterSeconds = 120;
    export const DefaultReminderIntervalSeconds = 120;
    export const MinimumSeconds = 10;
    export const MaximumSeconds = 3600;
    export const SettingsStorageKey =
        "mcc.rawDataDownloadReminderSettings";

    export type WarningReason =
        "ProgressApiUnavailable" |
        "InvalidProgressResponse" |
        "NoProgress";

    export interface Settings {
        warningAfterSeconds: number;
        reminderIntervalSeconds: number;
    }

    export interface SettingsValidationResult {
        settings: Settings;
        isValid: boolean;
        message: string;
    }

    export interface ProgressSnapshot {
        completedBatches: number;
        totalBatches: number;
        progressPercent: number;
        status: string;
        stopRequested: boolean;
    }

    export interface GuardSnapshot {
        reason: WarningReason;
        waitedSeconds: number;
        completedBatches: number;
        totalBatches: number;
        status: string;
    }

    export interface GuardOptions {
        warningAfterMilliseconds: number;
        reminderIntervalMilliseconds: number;
        onWarning: (snapshot: GuardSnapshot) => void;
    }

    export class Guard {
        private warningAfterMilliseconds: number;
        private reminderIntervalMilliseconds: number;
        private onWarning: (snapshot: GuardSnapshot) => void;
        private lastValidResponseAt: number;
        private lastProgressAt: number;
        private nextWarningAt: number;
        private lastCompletedBatches: number;
        private lastPercent: number;
        private lastSnapshot: ProgressSnapshot;
        private warningVisible: boolean;
        private stopRequested: boolean;
        private lastReason: WarningReason;

        constructor(options: GuardOptions) {
            const now = Date.now();

            this.warningAfterMilliseconds =
                options.warningAfterMilliseconds;
            this.reminderIntervalMilliseconds =
                options.reminderIntervalMilliseconds;
            this.onWarning = options.onWarning;
            this.lastValidResponseAt = now;
            this.lastProgressAt = now;
            this.nextWarningAt =
                now + this.warningAfterMilliseconds;
            this.lastCompletedBatches = 0;
            this.lastPercent = 0;
            this.lastSnapshot = {
                completedBatches: 0,
                totalBatches: 0,
                progressPercent: 0,
                status: "Queued",
                stopRequested: false
            };
            this.warningVisible = false;
            this.stopRequested = false;
            this.lastReason = "NoProgress";
        }

        public acceptProgress(
            snapshot: ProgressSnapshot): void {
            if (!this.isValidSnapshot(snapshot)) {
                this.acceptPollFailure(
                    "InvalidProgressResponse");
                return;
            }

            const now = Date.now();
            const terminal = this.isTerminalStatus(
                snapshot.status);
            const progressed =
                snapshot.completedBatches >
                    this.lastCompletedBatches ||
                snapshot.progressPercent > this.lastPercent ||
                terminal;

            this.lastValidResponseAt = now;
            this.lastSnapshot = snapshot;

            if (progressed) {
                this.lastProgressAt = now;
                this.lastCompletedBatches =
                    snapshot.completedBatches;
                this.lastPercent = snapshot.progressPercent;
                this.warningVisible = false;
                this.nextWarningAt =
                    now + this.warningAfterMilliseconds;
            }

            if (snapshot.stopRequested ||
                this.equalsIgnoreCase(
                    snapshot.status,
                    "StopRequested")) {
                this.stopRequested = true;
                this.warningVisible = false;
                return;
            }

            if (terminal) {
                this.warningVisible = false;
                return;
            }

            this.evaluateWarning();
        }

        public acceptPollFailure(
            reason: WarningReason): void {
            this.lastReason = reason;
            this.evaluateWarning();
        }

        public tick(): void {
            this.evaluateWarning();
        }

        public continueWaiting(): void {
            const now = Date.now();

            this.warningVisible = false;
            this.lastValidResponseAt = now;
            this.lastProgressAt = now;
            this.nextWarningAt =
                now + this.reminderIntervalMilliseconds;
        }

        public markStopRequested(): void {
            this.stopRequested = true;
            this.warningVisible = false;
        }

        public isWarningVisible(): boolean {
            return this.warningVisible;
        }

        public getWaitedSeconds(): number {
            const now = Date.now();
            const lastActivityAt = Math.min(
                this.lastValidResponseAt,
                this.lastProgressAt);

            return Math.max(
                0,
                Math.floor(
                    (now - lastActivityAt) / 1000));
        }

        private evaluateWarning(): void {
            if (this.stopRequested ||
                this.warningVisible ||
                this.isTerminalStatus(
                    this.lastSnapshot.status)) {
                return;
            }

            const now = Date.now();
            const noValidResponseFor =
                now - this.lastValidResponseAt;
            const noProgressFor =
                now - this.lastProgressAt;

            if (now < this.nextWarningAt ||
                (noValidResponseFor <
                    this.warningAfterMilliseconds &&
                 noProgressFor <
                    this.warningAfterMilliseconds)) {
                return;
            }

            const reason: WarningReason =
                noValidResponseFor >=
                this.warningAfterMilliseconds
                    ? this.lastReason === "NoProgress"
                        ? "ProgressApiUnavailable"
                        : this.lastReason
                    : "NoProgress";

            this.lastReason = reason;
            this.warningVisible = true;

            this.onWarning({
                reason: reason,
                waitedSeconds: this.getWaitedSeconds(),
                completedBatches:
                    this.lastSnapshot.completedBatches,
                totalBatches:
                    this.lastSnapshot.totalBatches,
                status: this.lastSnapshot.status
            });
        }

        private isValidSnapshot(
            snapshot: ProgressSnapshot): boolean {
            return !!snapshot &&
                typeof snapshot.status === "string" &&
                typeof snapshot.completedBatches === "number" &&
                isFinite(snapshot.completedBatches) &&
                typeof snapshot.totalBatches === "number" &&
                isFinite(snapshot.totalBatches) &&
                typeof snapshot.progressPercent === "number" &&
                isFinite(snapshot.progressPercent);
        }

        private isTerminalStatus(status: string): boolean {
            return this.equalsIgnoreCase(status, "Completed") ||
                this.equalsIgnoreCase(status, "Failed") ||
                this.equalsIgnoreCase(status, "Stopped");
        }

        private equalsIgnoreCase(
            left: string,
            right: string): boolean {
            return String(left || "").toLowerCase() ===
                String(right || "").toLowerCase();
        }
    }

    export function validateSettings(
        warningAfterSeconds: any,
        reminderIntervalSeconds: any): SettingsValidationResult {
        const warningAfter = Number(warningAfterSeconds);
        const reminderInterval = Number(reminderIntervalSeconds);
        const warningValid = isWholeNumberInRange(warningAfter);
        const reminderValid = isWholeNumberInRange(reminderInterval);

        if (warningValid && reminderValid) {
            return {
                settings: {
                    warningAfterSeconds: warningAfter,
                    reminderIntervalSeconds: reminderInterval
                },
                isValid: true,
                message: ""
            };
        }

        return {
            settings: {
                warningAfterSeconds:
                    DefaultWarningAfterSeconds,
                reminderIntervalSeconds:
                    DefaultReminderIntervalSeconds
            },
            isValid: false,
            message:
                "RawData 等待設定須為 " +
                MinimumSeconds + " 至 " +
                MaximumSeconds + " 秒的整數；已恢復安全預設值。"
        };
    }

    export function loadSettings(): SettingsValidationResult {
        try {
            const stored = window.localStorage.getItem(
                SettingsStorageKey);

            if (!stored) {
                return validateSettings(
                    DefaultWarningAfterSeconds,
                    DefaultReminderIntervalSeconds);
            }

            const parsed = JSON.parse(stored);

            return validateSettings(
                parsed.warningAfterSeconds,
                parsed.reminderIntervalSeconds);
        }
        catch (error) {
            return validateSettings(null, null);
        }
    }

    export function saveSettings(
        settings: Settings): void {
        window.localStorage.setItem(
            SettingsStorageKey,
            JSON.stringify(settings));
    }

    export function formatDuration(
        totalSeconds: number): string {
        const seconds = Math.max(0, Math.floor(totalSeconds || 0));
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return pad(hours) + ":" +
            pad(minutes) + ":" +
            pad(remainingSeconds);
    }

    function isWholeNumberInRange(value: number): boolean {
        return isFinite(value) &&
            Math.floor(value) === value &&
            value >= MinimumSeconds &&
            value <= MaximumSeconds;
    }

    function pad(value: number): string {
        return value < 10 ? "0" + value : String(value);
    }
}
