using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ficha1
{
    class Repo
    {
        private string name;

        public string Name
        {
            get { return name; }
            set { name = value; }
        }

        private string lang;

        public string Language
        {
            get { return lang; }
            set { lang = value; }
        }

        public Repo()
        {
        }

        public Repo(String name, String lang)
        {
            Name = name;
            Language = lang;
        }
    }
}
