using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MCClient2.Models.Structures
{
    public class RawDataDownloadJob
    {
        public string JobId { get; set; }

        public string TaskId { get; set; }

        public string Status { get; set; }

        public string Phase { get; set; }

        public string Message { get; set; }

        public int Percent { get; set; }

        public int CurrentBatch { get; set; }

        public int TotalBatch { get; set; }

        /*
         * TotalBatch / CurrentBatch are kept for the existing progress UI.
         * The following fields describe the whole download job and are
         * optional additions to the persisted JSON contract.
         */
        public int CompletedBatches { get; set; }

        public int TotalBatches { get; set; }

        public int RemainingBatches { get; set; }

        public DateTime? LastProgressAtUtc { get; set; }

        public bool StopRequested { get; set; }

        public bool PartialResult { get; set; }

        public long ProcessedCount { get; set; }

        public long TotalCount { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime? FinishTime { get; set; }

        public string Error { get; set; }
    }

    public class StartRawDataDownloadInput
    {
        public string TaskId { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string DataJson { get; set; }

        public string VariablesJson { get; set; }
    }
}
