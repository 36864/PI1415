using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ficha1
{
    class Org
    {
        public string Login { get; set; }
        private string location;

        public string Location
        {
            get { return location != null ? location : "Unkown Location"; }
            set { location = value; }
        }
        
        public string Avatar_URL { get; set; }
        public string Repos_URL { get; set; }
        public List<Repo> Repos { get; set; }
        
        public Org()
        {
            Repos = new List<Repo>();
        }
    }
}
