using System.Collections.Generic;

namespace jaymvc.Models.Home
{
    public class Todos : List<Todo>
    {
        public Todos(IEnumerable<Todo> items) : base(items)
        {

        }
    }
}