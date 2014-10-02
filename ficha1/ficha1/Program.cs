using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RestSharp;
using RestSharp.Deserializers;
namespace ficha1
{
    // c419d1442700aa09acec38622f6dbceca73b74af 
    //6cc637fc4c44405fab41ea4f837cef12d5bb9996
    class Program
    {

        static void addRepos (List<Repo> list, IRestResponse source, IDeserializer deserializer){
            list.AddRange(deserializer.Deserialize<List<Repo>>(source));
        }

        static int Main(string[] args)
        {

            if (args.Length < 1)
            {
                Console.WriteLine("Falta Organizacao");
                return 1;
            }

            var client = new RestClient("https://api.github.com/");
            //client.Authenticator = new HttpBasicAuthenticator(username, password);
            
            var request = new RestRequest("orgs/" + args[0], Method.GET);
            // easily add HTTP Headers
            request.AddHeader("host", "api.github.com");
            request.AddHeader("User-Agent", "36864");

            Org org = new Org();
            bool lastRepo = false;
            RestSharp.Deserializers.JsonDeserializer jsdes = new RestSharp.Deserializers.JsonDeserializer();
            
            client.ExecuteAsync<Org>(request, orgResponse =>
                {
                    org = jsdes.Deserialize<Org>(orgResponse);
                });
            request.Resource += "/repos";
            IRestResponse response = client.Execute(request);
            Parameter linkheader = response.Headers.First(a => a.Name == "Link");
            addRepos(org.Repos, response, jsdes);
            if (linkheader != null)
            {
                string linkval = linkheader.Value.ToString();
                while (linkval.Contains("next"))
                {
                    string nextURI = linkval.Substring(linkval.IndexOf('?'),linkval.Length - linkval.IndexOf('>'));
                    request.Resource = "orgs/" + args[0] + "/repos" + nextURI;
                    response = client.Execute(request);
                    addRepos(org.Repos, response, jsdes);
                    linkheader = response.Headers.First(a => a.Name == "Link");
                    linkval = linkheader.Value.ToString();
                }
                lastRepo = true;
            }
            else
            {
                lastRepo = true;
            }
            Dictionary<string, int> languages = new Dictionary<string,int>();
            foreach (Repo repo in org.Repos)
            {
                if (repo.Language == null)
                    repo.Language = "";
                if (!languages.ContainsKey(repo.Language))
                {
                    languages.Add(repo.Language, 1);
                }
                else
                {
                    ++languages[repo.Language];
                }
                    
            }
            while (org.Name == null || !lastRepo) ;
            Console.WriteLine(org.Name + "(" + org.Location + ")");
            foreach (var item in languages)
            {
                Console.WriteLine(item.Key + " - " + item.Value);
            }
            // easy async support
       //     client.ExecuteAsync(request, response =>
            //{
                //Console.WriteLine(response.Content);
            //});

            // async with deserialization
            //var asyncHandle = client.ExecuteAsync<Person>(request, response =>
            //{
                //Console.WriteLine(response.Data.Name);
            //});

            // abort the request on demand
            //asyncHandle.Abort();
            Console.Read();
            return 0;
        }
    }
}
