using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HtmlAgilityPack;
using System.Net;

namespace PICrawler
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 2)
            {
                Console.WriteLine("Parametros invalidos. Requer url e nivel de profundidade maxima.");
                return;
            }

            
            
            List<KeyValuePair<string, int>> links = new List<KeyValuePair<string,int>>();
            Dictionary<string, List<string>> wordList = new Dictionary<string, List<string>>();
            List<string> visitedURLs = new List<string>();
            int depth = Int32.Parse(args[1]);
            links.Add(new KeyValuePair<string, int>(args[0], depth));
            HtmlDocument doc = new HtmlDocument();
            HttpWebRequest request;
            HttpWebResponse response;
            Console.WriteLine("Crawling " + args[0] + ". Max depth: " + depth);


            while (links.Count > 0)
            {
                try
                { 
                request = (HttpWebRequest) WebRequest.Create(links[0].Key);
                response = (HttpWebResponse) request.GetResponse();
                doc.Load(response.GetResponseStream());
                if (response.Headers["content-type"].StartsWith("text/html")) { 
                    FindLinks(doc, links, links[0].Value, visitedURLs);
                    IndexWords(doc, links[0].Key, wordList);
                }
                }
                catch (InvalidCastException e)
                {
                    //caught a file link, ignore.
                }
                catch (Exception e)
                {
                    Console.WriteLine("Error: " + e + "\n on " + links[0].Key);
                }
                Console.Title = "Found " + links.Count + " links. Depth: " + links[0].Value;
                links.RemoveAt(0);                
            }
            string search;
            do
            {
                Console.WriteLine("Introduza termo de pesquisa (!exit) para terminar:");
                search = Console.ReadLine();
                if (wordList.ContainsKey(search.ToLower()))
                {
                    foreach (string url in wordList[search.ToLower()])
                    {
                        Console.WriteLine(url);
                    }
                }
            }
            while (search != "!exit");
        }

        private static void IndexWords(HtmlDocument doc, string url, Dictionary<string, List<string>> wordList)
        {
            if (doc.DocumentNode.SelectSingleNode("//body") == null) return; //no body
            foreach (HtmlNode node in doc.DocumentNode.SelectSingleNode("//body").SelectNodes("*"))
            {
                foreach (string content in node.InnerText.Split(new char[]{' ', '\n', '\t', '\r', '.', ',', ';', ':'}))
                {
                if (content.Length > 0)
                {                    
                    if (wordList.ContainsKey(content.ToLower()))
                    {
                        if (!wordList[content.ToLower()].Contains(url))
                            wordList[content.ToLower()].Add(url);
                    }
                    else
                    {
                        wordList.Add(content.ToLower(), new List<string> { url });
                    }
                }
            }
            }
        }

        private static void FindLinks(HtmlDocument doc, List<KeyValuePair<string, int>> links, int depth, List<string> visitedURLs)
        {
            if(depth <= 0) 
                return;
            depth -= 1;
            if(doc.DocumentNode.SelectNodes("//a[@href]") != null)
            foreach (HtmlNode link in doc.DocumentNode.SelectNodes("//a[@href]"))
            {                
                HtmlAttribute att = link.Attributes["href"];
                if(att.Value.StartsWith("http") || att.Value.StartsWith("//")){
                    if(!visitedURLs.Contains(att.Value))
                        links.Add(new KeyValuePair<string, int>(att.Value, depth));
                }
                else
                    if (att.Value.IndexOf('/') == 0 && att.Value.Length > 1)
                    {
                        att.Value = links[0].Key + att.Value;
                        if(!visitedURLs.Contains(att.Value))
                            links.Add(new KeyValuePair<string, int>(att.Value, depth));
                    }
            }
        }
    }
}
