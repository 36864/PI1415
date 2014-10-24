﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace ficha1
{
    class BootstrapUtils
    {
        public static HtmlNode GenerateNode(string tag, string _class, string value, string name, Dictionary<string, string> attributes)
        {
            string attributeline = "";
            if(attributes != null)
            foreach (var item in attributes)
            {
                attributeline += item.Key + "=\"" + item.Value + "\"";
            }
            HtmlNode node = HtmlNode.CreateNode("<" + tag + " " + "class=\"" + _class + "\" name=\"" + name + "\" " + attributeline + ">" + value + "</" + tag + ">");
            return node;
        }

        public static HtmlNode H1(string name, string value){
            return GenerateNode("h1", "", value, name, null);
        }
        public static HtmlNode H2(string name, string value)
        {
            return GenerateNode("h2", "", value, name, null);
        }
        public static HtmlNode H3(string name, string value)
        {
            return GenerateNode("h3", "", value, name, null);
        }

        public static string NameToContribLink(string name)
        {
           return "<a href=\"/contrib/" + name+"\">" + name + "</a>";
        }

        public static HtmlNode GraphEntry(string name, int count, double percentage)
        {
            HtmlNode node = GenerateNode("div", "row", "", "", null);
            //name
            node.AppendChild(GenerateNode("div", "col-xs-2 col-xs-offset-1", "", "", null))
                .AppendChild(GenerateNode("div", "name", name, "", null));
            Dictionary<string, string> attribs = new Dictionary<string, string>();
            attribs.Add("style", "width:"+percentage+"%");
            //bar
            node.AppendChild(GenerateNode("div", "col-xs-7", "", "", null))
                .AppendChild(GenerateNode("div", "graph", "", "", null))
                .AppendChild(GenerateNode("div", "bar", percentage.ToString().Substring(0, 4)+"%", "", attribs));
            //count
            node.AppendChild(GenerateNode("div", "col-xs-1", "", "", null))
                .AppendChild(GenerateNode("div", "count", count.ToString(), "", null));
            return node;
        }
    }
}
