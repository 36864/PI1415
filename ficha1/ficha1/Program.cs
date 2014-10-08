using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RestSharp;
using RestSharp.Deserializers;
namespace ficha1
{
    // c419d1442700aa09acec38622f6dbceca73b74af token
    //6cc637fc4c44405fab41ea4f837cef12d5bb9996
    class Program
    {

        static int biggerName=0;
        static int biggerAster = 45;
        static int total = 0;


        static void preDraw(Dictionary<string, int> m)
        {
       
            foreach (KeyValuePair<string, int> lang in m)
            {
                total += lang.Value;
                if (biggerName < lang.Key.Length)
                    biggerName = lang.Key.Length;         
            }
        }


        static void drawHist(Dictionary<string, int> m)
        {
            preDraw(m);
            biggerAster =Console.BufferWidth - biggerName - 23;
            string lineHist="";

            double p = 0.0, maxP=((double)biggerAster / total) * 100;
            string formRep, formP;
            foreach (KeyValuePair<string, int> lang in m)
            {
                p = ((double)lang.Value / total) * 100;
                lineHist = lang.Key.PadRight(biggerName, ' ')+": ";
                for (int i = (int)p; i > 0; i-- )
                    lineHist += '*';
                
                //lineHist = lineHist.PadRight((lineHist.Length - (int)p) + (int)maxP, ' ');
                lineHist = lineHist.PadRight((lineHist.Length - (int)p) + biggerAster, ' ');
                formRep=lang.Value/10==0 ? " " : "";
                formP = (int)p / 10 == 0 ? " " : "";
                //Console.WriteLine(p);
                lineHist += " ( "+ formP + String.Format("{0:0.0}", p) + "%, " + lang.Value + formRep + " repos)";
                Console.WriteLine(lineHist);
            }
        } 

        static void addRepos (List<Repo> list, IRestResponse source, IDeserializer deserializer){
            //adicionar repositórios a lista
            list.AddRange(deserializer.Deserialize<List<Repo>>(source));
        }

        static void addCollabs(Dictionary<string, int> collabs, IRestResponse source, IDeserializer deserializer)
        {
            foreach (Collab collab in deserializer.Deserialize<List<Collab>>(source))
            {
                if (collabs.ContainsKey(collab.ID))
                {
                    ++collabs[collab.ID];
                }
                else
                {
                    collabs.Add(collab.ID, 1);
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
            
            drawHist(languages);
            Console.WriteLine();
            Console.WriteLine("".PadRight(80, '-'));
            drawHist(collabs);
            
            Console.Read();
            return 0;
        }
    }
}
