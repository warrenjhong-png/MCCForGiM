using MCClient2.Models.Structures;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace MCClient2.Models.Managers
{
    public static class RawDataDownloadStatusManager
    {
        private static readonly object LockObject =
            new object();

        private static string GetStatusPath(
            string taskId,
            bool createDirectory)
        {
            string taskPath;

            if (!RawDataDownloadControlManager
                .TryGetTaskDirectory(
                    taskId,
                    out taskPath))
            {
                throw new ArgumentException(
                    "TaskId 無效",
                    nameof(taskId));
            }

            if (createDirectory)
            {
                Directory.CreateDirectory(taskPath);
            }

            return Path.Combine(
                taskPath,
                "rawdata_download_status.json"
            );
        }

        public static void Save(
            RawDataDownloadJob job)
        {
            if (job == null)
                return;

            string path =
                GetStatusPath(
                    job.TaskId,
                    true);

            string json =
                JsonConvert.SerializeObject(
                    job,
                    Formatting.Indented
                );

            lock (LockObject)
            {
                RawDataDownloadControlManager
                    .WriteAllTextAtomically(
                        path,
                        json);
            }
        }

        public static RawDataDownloadJob Read(
            string taskId)
        {
            string path =
                GetStatusPath(
                    taskId,
                    false);

            if (!File.Exists(path))
                return null;

            lock (LockObject)
            {
                string json =
                    File.ReadAllText(path);

                return JsonConvert
                    .DeserializeObject<
                        RawDataDownloadJob
                    >(json);
            }
        }
    }
}
