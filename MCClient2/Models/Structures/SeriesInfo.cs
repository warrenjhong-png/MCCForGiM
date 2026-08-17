using System;
using System.Collections.Generic;

namespace MCClient2.Models.Structures
{
    public class SeriesInfo : List<SerieInfo> { }

    public class SerieInfo
    {
        public string Id { get; set; }
        public string Step { get; set; }
        public  List<DateTime> Timetag { get; set; }
        public List<double> Data { get; set; }
    }


}