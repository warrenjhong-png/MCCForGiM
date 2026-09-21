using MCClient2.Models.Structures;
using Newtonsoft.Json;
using System;
using System.IO;

namespace MCClient2.Models.Managers
{
    internal class RawDataDownloadControlResult
    {
        public bool Success { get; set; }

        public string Status { get; set; }

        public string Message { get; set; }
    }

    internal class RawDataDownloadControlState
    {
        public string TaskId { get; set; }

        public DateTime RequestedAtUtc { get; set; }
    }

    internal static class RawDataDownloadControlManager
    {
        private const string ControlFileName =
            "rawdata_download_control.json";

        private static readonly object ControlLock =
            new object();

        internal static bool TryGetTaskDirectory(
            string taskId,
            out string taskDirectory)
        {
            taskDirectory = null;

            Guid taskGuid;

            if (!Guid.TryParse(taskId, out taskGuid))
            {
                return false;
            }

            string rootDirectory =
                Path.GetFullPath(
                    AppConstant.AvmModelDirPath);

            string normalizedRoot =
                rootDirectory.TrimEnd(
                    Path.DirectorySeparatorChar,
                    Path.AltDirectorySeparatorChar) +
                Path.DirectorySeparatorChar;

            string candidateDirectory =
                Path.GetFullPath(
                    Path.Combine(
                        rootDirectory,
                        taskGuid.ToString("D")));

            if (!candidateDirectory.StartsWith(
                normalizedRoot,
                StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            taskDirectory = candidateDirectory;

            return true;
        }

        internal static void ClearForNewTask(
            string taskId)
        {
            string taskDirectory;

            if (!TryGetTaskDirectory(
                taskId,
                out taskDirectory))
            {
                throw new ArgumentException(
                    "TaskId 無效",
                    nameof(taskId));
            }

            string controlPath =
                Path.Combine(
                    taskDirectory,
                    ControlFileName);

            lock (ControlLock)
            {
                if (File.Exists(controlPath))
                {
                    File.Delete(controlPath);
                }
            }
        }

        internal static RawDataDownloadControlResult
            RequestStop(string taskId)
        {
            string taskDirectory;

            if (!TryGetTaskDirectory(
                taskId,
                out taskDirectory))
            {
                return new RawDataDownloadControlResult
                {
                    Success = false,
                    Status = "InvalidTaskId",
                    Message = "TaskId 無效"
                };
            }

            if (!Directory.Exists(taskDirectory))
            {
                return new RawDataDownloadControlResult
                {
                    Success = false,
                    Status = "TaskNotFound",
                    Message = "找不到下載工作"
                };
            }

            RawDataDownloadJob job =
                RawDataDownloadStatusManager.Read(taskId);

            if (job == null)
            {
                return new RawDataDownloadControlResult
                {
                    Success = false,
                    Status = "TaskNotFound",
                    Message = "找不到下載工作"
                };
            }

            if (IsTerminalStatus(job.Status))
            {
                return new RawDataDownloadControlResult
                {
                    Success = true,
                    Status = job.Status,
                    Message = TerminalMessage(job.Status)
                };
            }

            lock (ControlLock)
            {
                WriteAllTextAtomically(
                    Path.Combine(
                        taskDirectory,
                        ControlFileName),
                    JsonConvert.SerializeObject(
                        new RawDataDownloadControlState
                        {
                            TaskId = taskId,
                            RequestedAtUtc = DateTime.UtcNow
                        },
                        Formatting.Indented));
            }

            job.StopRequested = true;
            job.Status = "StopRequested";
            job.Phase = "FinishingCurrentBatch";
            job.Message =
                "已收到停止要求，將在目前封包完成後停止";

            RawDataDownloadStatusManager.Save(job);

            AppConstant.Logger.Info(
                "RawData stop requested. TaskId=" +
                taskId);

            return new RawDataDownloadControlResult
            {
                Success = true,
                Status = "StopRequested",
                Message =
                    "已收到停止要求，將在目前封包完成後停止"
            };
        }

        internal static bool IsStopRequested(
            string taskId)
        {
            string taskDirectory;

            if (!TryGetTaskDirectory(
                taskId,
                out taskDirectory))
            {
                return false;
            }

            string controlPath =
                Path.Combine(
                    taskDirectory,
                    ControlFileName);

            lock (ControlLock)
            {
                return File.Exists(controlPath);
            }
        }

        internal static void MarkStopped(
            RawDataDownloadJob job)
        {
            if (job == null)
            {
                return;
            }

            job.Status = "Stopped";
            job.Phase = "Stopped";
            job.StopRequested = true;
            job.PartialResult = true;
            job.RemainingBatches = Math.Max(
                0,
                job.TotalBatches - job.CompletedBatches);
            job.Message =
                "下載已停止（部分完成），已完成 " +
                job.CompletedBatches + " / " +
                job.TotalBatches + " 批";
            job.FinishTime = DateTime.Now;
            job.LastProgressAtUtc = DateTime.UtcNow;

            RawDataDownloadStatusManager.Save(job);

            AppConstant.Logger.Info(
                "RawData stopped after current batch. TaskId=" +
                job.TaskId + "; CompletedBatches=" +
                job.CompletedBatches + "; TotalBatches=" +
                job.TotalBatches);
        }

        internal static bool IsTerminalStatus(
            string status)
        {
            return string.Equals(
                       status,
                       "Completed",
                       StringComparison.OrdinalIgnoreCase) ||
                   string.Equals(
                       status,
                       "Failed",
                       StringComparison.OrdinalIgnoreCase) ||
                   string.Equals(
                       status,
                       "Stopped",
                       StringComparison.OrdinalIgnoreCase);
        }

        internal static void WriteAllTextAtomically(
            string path,
            string contents)
        {
            string directory = Path.GetDirectoryName(path);

            if (!string.IsNullOrWhiteSpace(directory))
            {
                Directory.CreateDirectory(directory);
            }

            string tempPath =
                path + "." + Guid.NewGuid() + ".tmp";

            File.WriteAllText(tempPath, contents);

            try
            {
                if (File.Exists(path))
                {
                    try
                    {
                        File.Replace(
                            tempPath,
                            path,
                            null);
                    }
                    catch (IOException)
                    {
                        // File.Replace is not supported by every filesystem/
                        // deployment target. Fall back to a replace sequence.
                        File.Delete(path);
                        File.Move(tempPath, path);
                    }
                }
                else
                {
                    File.Move(tempPath, path);
                }
            }
            finally
            {
                if (File.Exists(tempPath))
                {
                    File.Delete(tempPath);
                }
            }
        }

        private static string TerminalMessage(
            string status)
        {
            if (string.Equals(
                status,
                "Completed",
                StringComparison.OrdinalIgnoreCase))
            {
                return "下載已完成";
            }

            if (string.Equals(
                status,
                "Stopped",
                StringComparison.OrdinalIgnoreCase))
            {
                return "下載已停止（部分完成）";
            }

            return "下載工作已失敗";
        }
    }
}
