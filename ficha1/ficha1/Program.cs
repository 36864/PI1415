using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RestSharp;

namespace ficha1
{
    // c419d1442700aa09acec38622f6dbceca73b74af token
    class Program
    {
        static int Main(string[] args)
        {

            if (args.Length < 1)
            {
                Console.WriteLine("Falta Organizacao");
                return 1;
            }

            var client = new RestClient("https://api.github.com/");
           
            var request = new RestRequest("orgs/" + args[0]+ "/repos", Method.GET);

            // easily add HTTP Headers
            //request.AddHeader("Host", "api.github.com");
            
            var response3 = client.Execute(request);
            //RestResponse 
            Console.WriteLine(response3.Content);
            // or automatically deserialize result
            // return content type is sniffed but can be explicitly set via RestClient.AddHandler();

            RestResponse<Repo> response2 = (RestResponse<Repo>) client.Execute<Repo>(request);
            //var name = response2.Data.Name;

            // easy async support
            client.ExecuteAsync(request, response =>
            {
                Console.WriteLine(response.Content);
            });

            // async with deserialization
            //var asyncHandle = client.ExecuteAsync<Person>(request, response =>
            //{
                //Console.WriteLine(response.Data.Name);
            //});

            // abort the request on demand
            //asyncHandle.Abort();
            return 0;
        }
    }
}
