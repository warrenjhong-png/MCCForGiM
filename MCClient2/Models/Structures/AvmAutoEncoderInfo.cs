using Newtonsoft.Json;

namespace MCClient2.Models.Structures
{
    public class AvmAutoEncoderInfo
    {
        public int[] filters { get; set; }
        public int[] kernel_size { get; set; }
        public string activation { get; set; }
        public int[] pool_size { get; set; }
        public int[] epoch { get; set; }

        [JsonProperty("learning rate")]
        public float[] learningrate { get; set; }
        public int[] patience { get; set; }
        public int[] batch { get; set; }
        public float[] dropout { get; set; }
        public float[] moment { get; set; }
        public int[] tune_frequency { get; set; }
        public int[] model_frequency { get; set; }
        public int[] virtual_cassette { get; set; }
        public int[] DMW_switch { get; set; }
    }

}