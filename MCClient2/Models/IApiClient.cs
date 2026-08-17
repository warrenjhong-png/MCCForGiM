namespace MCClient2.Models
{
    internal interface IApiClient
    {
        string BaseUrl { get; set; }

        string PostData(string requestUri, string postData);
        bool PostDataWithoutQuery(string requestUri, string postData);
    }
}