using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ficha1
{
    class Collab
    {
        private string login;
        public string Login { get { return login == null ? "Unkown Contributor" : login;} set { login = value; } }
        private string name;

        public string Name
        {
            get { return name != null ? name : ""; }
            set { name = value; }
        }

        private string email;

        public string Email
        {
            get { return email != null ? email : ""; }
            set { email = value; }
        }

        private string avatar_url;

        public string Avatar_URL
        {
            get { return avatar_url != null ? avatar_url : ""; }
            set { avatar_url = value; }
        }

        private string url;

        public string URL
        {
            get { return url != null ? url : ""; }
            set { url = value; }
        }

        public int contributions { get; set; }
        
    }
}
