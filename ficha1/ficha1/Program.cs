using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using RestSharp;
using RestSharp.Deserializers;
using HtmlAgilityPack;
namespace ficha1
{
    // c419d1442700aa09acec38622f6dbceca73b74af token
    //6cc637fc4c44405fab41ea4f837cef12d5bb9996
    class Program
    {
        static string BASE_URL = "https://api.github.com/";
        
        static string BASE_HTML_ORG = "../../base_org.html";
        static string BASE_HTML_INDEX = "../../base_index.html";
        static string BASE_HTML_COLLAB = "../../base_collab.html";
        
        static int TOTAL_LANG = 0, TOTAL_COLLAB = 0;

        static void AddRepos (List<Repo> list, IRestResponse source, IDeserializer deserializer){
            //adicionar repositórios a lista
            list.AddRange(deserializer.Deserialize<List<Repo>>(source));
        }

        static void AddCollabs(Dictionary<string, int> collabs, IRestResponse source, IDeserializer deserializer)
        {
            foreach (Collab collab in deserializer.Deserialize<List<Collab>>(source))
            {
                if (collabs.ContainsKey(collab.Login))
                {
                    ++collabs[collab.Login];
                }
                else
                {
                    collabs.Add(collab.Login, 1);
                }
                ++TOTAL_COLLAB;
            }
        }

        static int Main(string[] args)
        {

            if (args.Length < 1)
            {
                Console.WriteLine("Falta Organizacao");
                return 1;
            }

            RestClient client = new RestClient(BASE_URL);
            Org org = new Org();
            JsonDeserializer jsdes = new JsonDeserializer();


            RestRequest orgRequest = new RestRequest("orgs/" + args[0]);
            AddRequestHeaders(orgRequest);
            HttpHelper orgHelper = new HttpHelper(client, orgRequest, response => org = jsdes.Deserialize<Org>(response));
            orgHelper.ExecuteRequest();
            while (!orgHelper.IsDone) ;

            Console.WriteLine("Got " + org.Name + " info.");
            Console.WriteLine("Getting repos for " + org.Name);
            RestRequest repoRequest = new RestRequest(org.Repos_URL);
            AddRequestHeaders(repoRequest);
            HttpHelper repoHelper = new HttpHelper(client, repoRequest, response => AddRepos(org.Repos, response, jsdes));
            repoHelper.ExecuteRequest();
            while (!repoHelper.IsDone) ;
            Console.WriteLine("Got " + org.Name + " repos.");

            
            Dictionary<string, int> languages = new Dictionary<string, int>();
            Dictionary<string, int> collabs = new Dictionary<string, int>();

            List<HttpHelper> collabHelpers = new List<HttpHelper>();

            //Construir lista de linguagens
            foreach (Repo repo in org.Repos)
            {
                if (!languages.ContainsKey(repo.Language))
                {
                    languages.Add(repo.Language, 1);
                }
                else
                {
                    ++languages[repo.Language];
                }
                ++TOTAL_LANG;                
                
                //pedir lista de colaboradores, adicionar ao dicionário
                if (repo.Contributors_url != null) {
                    RestRequest req = new RestRequest(repo.Contributors_url);
                    AddRequestHeaders(req);
                    HttpHelper ch = new HttpHelper(client, req, collabResponse => AddCollabs(collabs, collabResponse, jsdes));
                    collabHelpers.Add(ch);
                    ch.ExecuteRequest();
                }
            }
            Console.WriteLine("Finished language count");
            languages = languages.OrderBy(c => c.Key).ToDictionary(t => t.Key, t => t.Value);

            while (collabHelpers.Exists(ch => !ch.IsDone)) ; //wait for collab requests
            
            Console.WriteLine("Generating HTML");
            generateHtml(org, languages, collabs);

            Console.WriteLine("Finished");
            Console.Read();
            return 0;
        }



        private static void AddRequestHeaders(RestRequest orgRequest)
        {
            orgRequest.AddHeader("host", "api.github.com");
            orgRequest.AddHeader("User-Agent", "36864");
            orgRequest.AddHeader("Authorization", "token 6cc637fc4c44405fab41ea4f837cef12d5bb9996");
        }

        

       
        private static void generateHtml(Org org, Dictionary<string, int> languages, Dictionary<string, int> collabs)
        {
            HtmlDocument doc = new HtmlDocument();
            doc.Load(BASE_HTML_ORG);
            HtmlNode rootNode = doc.DocumentNode;

            //add org info
            rootNode.SelectSingleNode("//img[@name=\"avatar\"]").SetAttributeValue("src", org.Avatar_URL);
            rootNode.SelectSingleNode("//h1[@name=\"org\"]").AppendChild(HtmlTextNode.CreateNode(org.Name));
            rootNode.SelectSingleNode("//h3[@name=\"location\"]").AppendChild(HtmlTextNode.CreateNode(org.Location));
            
            //generate language graph
            HtmlNode langgraph = rootNode.SelectSingleNode("//div[@name=\"languagegraph\"]");
            foreach (var item in languages)
            {
                langgraph.AppendChild(BootstrapUtils.GraphEntry(item.Key, item.Value, item.Value*100.0d / TOTAL_LANG));
            }

            //generage collaborator graph
            HtmlNode collabgraph = rootNode.SelectSingleNode("//div[@name=\"collabgraph\"]");
            foreach (var item in collabs)
            {
                collabgraph.AppendChild(BootstrapUtils.GraphEntry(BootstrapUtils.NameToContribLink(item.Key), item.Value, item.Value * 100.0d / TOTAL_COLLAB));
            }

            StreamWriter f = File.CreateText("test.html");
            doc.Save(f);

        }
    }
}
