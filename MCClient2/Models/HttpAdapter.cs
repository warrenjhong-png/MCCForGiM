using System;
using System.Net.Http;
using System.Text;

namespace MCClient2.Models
{
    internal class HttpAdapter : IApiClient
    {
        private readonly HttpClient _client = new HttpClient();
        private Uri _baseUri = new Uri("http://localhot/");
        public string BaseUrl
        {
            get
            {
                return _baseUri.OriginalString;
            }

            set
            {
                _baseUri = new Uri(value);
            }
        }

        public string PostData(string requestUri, string postData)
        {
            string json = string.Empty;
            try
            {
                using (HttpContent contentPost = new StringContent(postData, Encoding.UTF8, "application/json"))
                {
                    using (HttpResponseMessage response = _client.PostAsync(new Uri(_baseUri, requestUri), contentPost).Result)
                    {
                        if (response.IsSuccessStatusCode == false)
                        {
                            return string.Empty;
                        }

                        // 將網路取得回應的內容設定給 httpcontent，可省略，直接使用 response.Content
                        using (HttpContent content = response.Content)
                        {
                            // 將 httpcontent 轉為 string
                            json = content.ReadAsStringAsync().Result;
                        }
                    }
                }
            }catch(Exception e)
            {
                return e.Message;
            }
            return json;
        }

        public bool PostDataWithoutQuery(string requestUri, string postData)
        {
            using (HttpContent contentPost = new StringContent(postData, Encoding.UTF8, "application/json"))
            {
                using (HttpResponseMessage response = _client.PostAsync(new Uri(_baseUri, requestUri), contentPost).Result)
                {
                    return response.IsSuccessStatusCode;
                }
            }
        }
    }
}