using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ficha1
{
    class Repo
    {
        public string Name { get; set; }
        public string Language { get; set; }
        private string collaborators_url;
        public string Collaborators_url { get { return collaborators_url.Replace("{/collaborator}", "").Replace("https://api.github.com", ""); } set { collaborators_url = value; } }
    }
}
