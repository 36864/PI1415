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
        
        static List<Org> orgs = new List<Org>();

        static void AddRepos(List<Repo> list, IRestResponse source, IDeserializer deserializer)
        {
           //adicionar repositórios a lista
            list.AddRange(deserializer.Deserialize<List<Repo>>(source));
        }

        static void AddCollabs(Org o, Dictionary<string, int> collabs, IRestResponse source, IDeserializer deserializer)
        {
            foreach (Collab collab in deserializer.Deserialize<List<Collab>>(source))
            {
                //o.colbs.Add(collab);
                if (collabs.ContainsKey(collab.Login))
                {
                    ++collabs[collab.Login];
                }
                else
                {
                    collabs.Add(collab.Login, 1);
                    o.colbs.Add(collab);
                }
                ++TOTAL_COLLAB;
            }
        }

        static void GenerateOrgPage(string orgname, RestClient client) {
            Org org = new Org();

            JsonDeserializer jsdes = new JsonDeserializer();

            RestRequest orgRequest = new RestRequest("orgs/" + orgname);
            AddRequestHeaders(orgRequest);
            HttpHelper orgHelper = new HttpHelper(client, orgRequest, response => org = jsdes.Deserialize<Org>(response));
            orgHelper.ExecuteRequest();
            while (!orgHelper.IsDone) ;
            orgs.Add(org);
            Console.WriteLine("Got " + org.Login + " info.");
            Console.WriteLine("Getting repos for " + org.Login);
            RestRequest repoRequest = new RestRequest(org.Repos_URL);
            AddRequestHeaders(repoRequest);
            HttpHelper repoHelper = new HttpHelper(client, repoRequest, response => AddRepos(org.Repos, response, jsdes));
            repoHelper.ExecuteRequest();
            while (!repoHelper.IsDone) ;
            Console.WriteLine("Got " + org.Login + " repos.");

            
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
                    HttpHelper ch = new HttpHelper(client, req, collabResponse => AddCollabs(org, collabs, collabResponse, jsdes));
                    collabHelpers.Add(ch);
                    ch.ExecuteRequestAsync();
                }
            }
            Console.WriteLine("Finished language count for " + org.Login);
            languages = languages.OrderBy(c => c.Key).ToDictionary(t => t.Key, t => t.Value);

            while (collabHelpers.Exists(ch => !ch.IsDone)) ; //wait for collab requests
            
            Console.WriteLine("Generating org HTML for " + org.Login);
            generateHtml(org, languages, collabs);

            Console.WriteLine("Finished " + org.Login);
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
            rootNode.SelectSingleNode("//h1[@name=\"org\"]").AppendChild(HtmlTextNode.CreateNode(org.Login));
            rootNode.SelectSingleNode("//h3[@name=\"location\"]").AppendChild(HtmlTextNode.CreateNode(org.Location));
            rootNode.SelectSingleNode("//node()[@name=\"indexlink\"]").AppendChild(HtmlNode.CreateNode("<a href=\"../index.html\">Index</a>"));
            rootNode.SelectSingleNode("//title").AppendChild(HtmlTextNode.CreateNode(org.Login));
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

            StreamWriter f = File.CreateText("../../org/"+org.Login+".html");
            doc.Save(f);
            generateContHtml(org.colbs);
        }

        public static void generateIndHtml(){
            HtmlDocument doc = new HtmlDocument();
            doc.Load(BASE_HTML_INDEX);
            HtmlNode rootNode = doc.DocumentNode;

            if (orgs.Count==0){
                rootNode.SelectSingleNode("//h1[@name=\"org\"]").AppendChild(HtmlTextNode.CreateNode("Não há organizações."));
            }
            
            //add orgs
            foreach (Org o in orgs)
            {

                rootNode.SelectSingleNode("//div[@name=\"orgs\"]").AppendChild(HtmlTextNode.CreateNode("<div class=\"row\"><div class=\"col-xs-4 col-xs-offset-1\"><a href=\"../org/"+o.Login+".html\"><h1 class=\"text-center\">" + o.Login + "</h1></a></div><div class=\"col-xs-3\"><img src=\"" + o.Avatar_URL + "\" width=100% height=100%/></div>"));
                /*rootNode.SelectSingleNode("//img[@name=\"avatar\"]").SetAttributeValue("src", o.Avatar_URL);
                rootNode.SelectSingleNode("//h1[@name=\"org\"]").AppendChild(HtmlTextNode.CreateNode(o.Login));*/
            }
            StreamWriter f = File.CreateText("../../org/index.html");
            doc.Save(f);
        }

        private static void generateContHtml(List<Collab> clbs)
        {
            HtmlDocument doc = new HtmlDocument();
           
            foreach (Collab c in clbs)
            {
                doc.Load(BASE_HTML_COLLAB);
                HtmlNode rootNode = doc.DocumentNode;

                //add collab info
                rootNode.SelectSingleNode("//img[@name=\"avatar\"]").SetAttributeValue("src", c.Avatar_URL);
                rootNode.SelectSingleNode("//h2[@name=\"collab\"]").AppendChild(HtmlTextNode.CreateNode(c.Login));
                rootNode.SelectSingleNode("//node()[@name=\"indexlink\"]").AppendChild(HtmlNode.CreateNode("<a href=\"../index.html\">Index</a>"));
                rootNode.SelectSingleNode("//title").AppendChild(HtmlTextNode.CreateNode(c.Login));

                //info collab
                HtmlNode ul = rootNode.SelectSingleNode("//ul[@name=\"infoC\"]");
                if (c.Name.Length > 0) 
                    ul.AppendChild(HtmlNode.CreateNode("<li><h4>NAME: </h4>" +c.Name+"</li>"));

                if (c.URL.Length>0)
                    ul.AppendChild(HtmlNode.CreateNode("<li><h4>URL PAGE: </h4><a href=\""+c.URL+"\">"+c.URL+"</a></li>"));
               // rootNode.SelectSingleNode("//li[@name=\"name\"]").AppendChild(HtmlTextNode.CreateNode("<h4>NAME: </h4>" +c.Login));
                if (c.Email.Length>0)
                    ul.AppendChild(HtmlTextNode.CreateNode("<li><h4>EMAIL: </h4>" + c.Email + "</li>"));

                StreamWriter f = File.CreateText("../../org/contrib/" + c.Login + ".html");
                doc.Save(f);
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
            List<Task> tasks = new List<Task>();
            foreach (string orgname in args)
            {
                tasks.Add(Task.Run(() => GenerateOrgPage(orgname, client)));
            }
            Task.WaitAll(tasks.ToArray());
            generateIndHtml();
            Console.WriteLine("Completed all tasks.");
            Console.Read();
            return 0;
        }

    }

}