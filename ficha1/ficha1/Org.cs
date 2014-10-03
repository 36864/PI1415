using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ficha1
{
    class Org
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public List<Repo> Repos { get; set; }

        public Org()
        {
            Repos = new List<Repo>();
        }
    }
}
