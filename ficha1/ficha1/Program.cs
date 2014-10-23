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

        static int BIGGERNAME=0;
        static int BIGGERASTER = 45;
        static int TOTAL = 0;
        static string BASEHTML = "base.html";

        static void preDraw(Dictionary<string, int> m)
        {
       
            foreach (KeyValuePair<string, int> lang in m)
            {
                TOTAL += lang.Value;
                if (BIGGERNAME < lang.Key.Length)
                    BIGGERNAME = lang.Key.Length;         
            }
        }


        static void drawHist(Dictionary<string, int> m)
        {
            preDraw(m);
            BIGGERASTER =Console.BufferWidth - BIGGERNAME - 23;
            string lineHist="";

            double p = 0.0, maxP=((double)BIGGERASTER / TOTAL) * 100;
            string formRep, formP;
            foreach (KeyValuePair<string, int> lang in m)
            {
                p = ((double)lang.Value / TOTAL) * 100;
                lineHist = lang.Key.PadRight(BIGGERNAME, ' ')+": ";
                for (int i = (int)p; i > 0; i-- )
                    lineHist += '*';
                
                lineHist = lineHist.PadRight((lineHist.Length - (int)p) + BIGGERASTER, ' ');
                formRep=lang.Value/10==0 ? " " : "";
                formP = (int)p / 10 == 0 ? " " : "";
                //Console.WriteLine(p);
                lineHist += " ( "+ formP + String.Format("{0:0.0}", p) + "%, " + lang.Value + formRep + " repos)";
                Console.WriteLine(lineHist);
            }
        }


       static void pageforcollabs(Dictionary<string, int> cs)
       {

       }

        static void addRepos (List<Repo> list, IRestResponse source, IDeserializer deserializer){
            //adicionar repositórios a lista
            list.AddRange(deserializer.Deserialize<List<Repo>>(source));
        }

        static void addCollabs(Dictionary<string, int> collabs, IRestResponse source, IDeserializer deserializer)
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
            }
        }

        static int Main(string[] args)
        {

            if (args.Length < 1)
            {
                Console.WriteLine("Falta Organizacao");
                return 1;
            }

            var client = new RestClient("https://api.github.com/");
           
            var request = new RestRequest("orgs/" + args[0], Method.GET);

            // easily add HTTP Headers
            request.AddHeader("host", "api.github.com");
            request.AddHeader("User-Agent", "36864");
            request.AddHeader("Authorization", "token 6cc637fc4c44405fab41ea4f837cef12d5bb9996");

            //criar estruturas
            Org org = new Org();
            RestSharp.Deserializers.JsonDeserializer jsdes = new RestSharp.Deserializers.JsonDeserializer();

            //pedir info da organizacao (async, só necessário para apresentação no fim)
            client.ExecuteAsync<Org>(request, orgResponse =>
                {
                    org = jsdes.Deserialize<Org>(orgResponse);
                });

            //pedir lista de repositorios (sync, necessário antes de tentar obter lista de colaboradores)
            request.Resource += "/repos";
            IRestResponse response = client.Execute(request);

            //obter paginação
            Parameter linkheader = response.Headers.First(a => a.Name == "Link");
            //adicionar repositórios à lista
            addRepos(org.Repos, response, jsdes);

            Console.WriteLine(org.Name + "(" + org.Location + ")");
            Console.WriteLine("".PadRight(80,'-'));
            //verificar paginação, pedir restantes repositórios de forma síncrona se existentes
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
            }
            
            Dictionary<string, int> languages = new Dictionary<string,int>();
            Dictionary<string, int> collabs = new Dictionary<string, int>();
            int repoCount = 0;

            foreach (Repo repo in org.Repos)
            {
                ++repoCount;
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
                request.Resource = repo.Collaborators_url;
                //pedir lista de collaboradores, adicionar ao dicionário, decrementar contador
                client.ExecuteAsync(request, collabResponse => { addCollabs(collabs, collabResponse, jsdes); --repoCount; });
            }
            
            languages = languages.OrderBy(c => c.Key).ToDictionary(t => t.Key, t => t.Value);
            
            while (org.Name == null || repoCount != 0) ; //esperar por chamadas async, se necessário

            generateHtml(args[0], languages, collabs);

            drawHist(languages);
            Console.WriteLine();
            Console.WriteLine("".PadRight(80, '-'));
            drawHist(collabs);
            
            Console.Read();
            return 0;
        }

        private static void generateHtml(string p, Dictionary<string, int> languages, Dictionary<string, int> collabs)
        {
            HtmlDocument doc = new HtmlDocument();
            doc.Load(BASEHTML);           
            HtmlNode header = HtmlNode.CreateNode("<h1>" + p + "</h1>");
            doc.DocumentNode.ChildNodes.FindFirst("body").PrependChild(header);
            
        }
    }
}
