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
            string taskId)
        {
            string taskPath =
                PathHelper.GetDirPath(taskId);

            Directory.CreateDirectory(taskPath);

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
                GetStatusPath(job.TaskId);

            string json =
                JsonConvert.SerializeObject(
                    job,
                    Formatting.Indented
                );

            lock (LockObject)
            {
                string tempPath =
                    path + ".tmp";

                File.WriteAllText(
                    tempPath,
                    json
                );

                if (File.Exists(path))
                    File.Delete(path);

                File.Move(
                    tempPath,
                    path
                );
            }
        }

        public static RawDataDownloadJob Read(
            string taskId)
        {
            string path =
                GetStatusPath(taskId);

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