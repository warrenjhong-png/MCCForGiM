using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MCClient2.Models.Structures
{
    public class ModelMetadata
    {
        public string RootModelId { get; set; }
        public string RootModelName { get; set; }
    }

    public class DownloadRawDataInput
    {
        public string TaskId { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string DataJson { get; set; }

        public List<Variables> Variables { get; set; }
    }
}