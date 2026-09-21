var RawDataDownloadGuard;
(function (RawDataDownloadGuard) {
    RawDataDownloadGuard.DefaultWarningAfterSeconds = 120;
    RawDataDownloadGuard.DefaultReminderIntervalSeconds = 120;
    RawDataDownloadGuard.MinimumSeconds = 10;
    RawDataDownloadGuard.MaximumSeconds = 3600;
    RawDataDownloadGuard.SettingsStorageKey = "mcc.rawDataDownloadReminderSettings";
    class Guard {
        constructor(options) {
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
        acceptProgress(snapshot) {
            if (!this.isValidSnapshot(snapshot)) {
                this.acceptPollFailure("InvalidProgressResponse");
                return;
            }
            const now = Date.now();
            const terminal = this.isTerminalStatus(snapshot.status);
            const progressed = snapshot.completedBatches >
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
                this.equalsIgnoreCase(snapshot.status, "StopRequested")) {
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
        acceptPollFailure(reason) {
            this.lastReason = reason;
            this.evaluateWarning();
        }
        tick() {
            this.evaluateWarning();
        }
        continueWaiting() {
            const now = Date.now();
            this.warningVisible = false;
            this.lastValidResponseAt = now;
            this.lastProgressAt = now;
            this.nextWarningAt =
                now + this.reminderIntervalMilliseconds;
        }
        markStopRequested() {
            this.stopRequested = true;
            this.warningVisible = false;
        }
        isWarningVisible() {
            return this.warningVisible;
        }
        getWaitedSeconds() {
            const now = Date.now();
            const lastActivityAt = Math.min(this.lastValidResponseAt, this.lastProgressAt);
            return Math.max(0, Math.floor((now - lastActivityAt) / 1000));
        }
        evaluateWarning() {
            if (this.stopRequested ||
                this.warningVisible ||
                this.isTerminalStatus(this.lastSnapshot.status)) {
                return;
            }
            const now = Date.now();
            const noValidResponseFor = now - this.lastValidResponseAt;
            const noProgressFor = now - this.lastProgressAt;
            if (now < this.nextWarningAt ||
                (noValidResponseFor <
                    this.warningAfterMilliseconds &&
                    noProgressFor <
                        this.warningAfterMilliseconds)) {
                return;
            }
            const reason = noValidResponseFor >=
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
                completedBatches: this.lastSnapshot.completedBatches,
                totalBatches: this.lastSnapshot.totalBatches,
                status: this.lastSnapshot.status
            });
        }
        isValidSnapshot(snapshot) {
            return !!snapshot &&
                typeof snapshot.status === "string" &&
                typeof snapshot.completedBatches === "number" &&
                isFinite(snapshot.completedBatches) &&
                typeof snapshot.totalBatches === "number" &&
                isFinite(snapshot.totalBatches) &&
                typeof snapshot.progressPercent === "number" &&
                isFinite(snapshot.progressPercent);
        }
        isTerminalStatus(status) {
            return this.equalsIgnoreCase(status, "Completed") ||
                this.equalsIgnoreCase(status, "Failed") ||
                this.equalsIgnoreCase(status, "Stopped");
        }
        equalsIgnoreCase(left, right) {
            return String(left || "").toLowerCase() ===
                String(right || "").toLowerCase();
        }
    }
    RawDataDownloadGuard.Guard = Guard;
    function validateSettings(warningAfterSeconds, reminderIntervalSeconds) {
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
                warningAfterSeconds: RawDataDownloadGuard.DefaultWarningAfterSeconds,
                reminderIntervalSeconds: RawDataDownloadGuard.DefaultReminderIntervalSeconds
            },
            isValid: false,
            message: "RawData 等待設定須為 " +
                RawDataDownloadGuard.MinimumSeconds + " 至 " +
                RawDataDownloadGuard.MaximumSeconds + " 秒的整數；已恢復安全預設值。"
        };
    }
    RawDataDownloadGuard.validateSettings = validateSettings;
    function loadSettings() {
        try {
            const stored = window.localStorage.getItem(RawDataDownloadGuard.SettingsStorageKey);
            if (!stored) {
                return validateSettings(RawDataDownloadGuard.DefaultWarningAfterSeconds, RawDataDownloadGuard.DefaultReminderIntervalSeconds);
            }
            const parsed = JSON.parse(stored);
            return validateSettings(parsed.warningAfterSeconds, parsed.reminderIntervalSeconds);
        }
        catch (error) {
            return validateSettings(null, null);
        }
    }
    RawDataDownloadGuard.loadSettings = loadSettings;
    function saveSettings(settings) {
        window.localStorage.setItem(RawDataDownloadGuard.SettingsStorageKey, JSON.stringify(settings));
    }
    RawDataDownloadGuard.saveSettings = saveSettings;
    function formatDuration(totalSeconds) {
        const seconds = Math.max(0, Math.floor(totalSeconds || 0));
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return pad(hours) + ":" +
            pad(minutes) + ":" +
            pad(remainingSeconds);
    }
    RawDataDownloadGuard.formatDuration = formatDuration;
    function isWholeNumberInRange(value) {
        return isFinite(value) &&
            Math.floor(value) === value &&
            value >= RawDataDownloadGuard.MinimumSeconds &&
            value <= RawDataDownloadGuard.MaximumSeconds;
    }
    function pad(value) {
        return value < 10 ? "0" + value : String(value);
    }
})(RawDataDownloadGuard || (RawDataDownloadGuard = {}));
//# sourceMappingURL=RawDataDownloadGuard.js.map