using System;
using System.Collections.Generic;
using System.Linq;
using jaymvc.Models;
using jaymvc.Models.Home;

namespace jaymvc.Services
{
    public interface ITodoService
    {
        Todos All();
        void Save(Guid? id, Guid assignedTo, ActionItemPriorityConstants priority, DateTime due, string text);
        Todo One(Guid id);
        Todo New();
        void Complete(Guid id);
        TypeAheadResult[] AssigneeSearch(string query);

    }
    
    class TodoService:ITodoService
    {
        private readonly IDictionary<Guid,Todo> _todos;
        private readonly IDictionary<Guid, (string first, string last)> _assignees;

        public TodoService()
        {
            _todos = new Dictionary<Guid, Todo>();
            _assignees = new Dictionary<Guid, (string first, string last)>
            {
                {Guid.NewGuid(), ("Jay", "Brummels")},
                {Guid.NewGuid(), ("Josh", "Brummels")},
                {Guid.NewGuid(), ("Justin", "Brummels")},
                {Guid.NewGuid(), ("Jaime", "Brummels")},
                {Guid.NewGuid(), ("Japheth", "Brummels")},
                {Guid.NewGuid(), ("Mariella", "Brummels")},
                {Guid.NewGuid(), ("Loghan", "Brummels")},
                {Guid.NewGuid(), ("Kirstin", "Brummels")}
            };
        }
        
        public Todos All()
        {
            return new Todos(_todos.Values);                
        }

        public void Save(Guid? id, Guid assignedTo, ActionItemPriorityConstants priority, DateTime due, string text)
        {
            if (id.HasValue && _todos.TryGetValue(id.Value, out var it))
            {
                it.Priority = priority;
                it.DueDate = due;
                it.Text = text;
                it.AssignedToId = assignedTo;
                it.AssignedToName = $"{_assignees[assignedTo].first} {_assignees[assignedTo].last}";
            }
            else
            {
                var @new = Guid.NewGuid();
                _todos.Add(@new,  new Todo
                {
                    Id = @new,
                    DueDate = due,
                    Priority = priority,
                    Text = text,
                    AssignedToId = assignedTo,
                    AssignedToName = $"{_assignees[assignedTo].first} {_assignees[assignedTo].last}"
                });
            }
        }

        public Todo One(Guid id)
        {
            if(_todos.TryGetValue(id, out var it))
            {
                return it;
            }

            return null;
        }

        public Todo New()
        {
            return new Todo();
        }

        public void Complete(Guid id)
        {
            if (_todos.ContainsKey(id))
                _todos.Remove(id);
        }

        public TypeAheadResult[] AssigneeSearch(string searchString)
        {
            return _assignees
                .Where(p =>
                    p.Value.first.Contains(searchString, StringComparison.CurrentCultureIgnoreCase) ||
                    p.Value.last.Contains(searchString, StringComparison.CurrentCultureIgnoreCase) ||
                    $"{p.Value.first} {p.Value.last}".Contains(searchString,
                        StringComparison.CurrentCultureIgnoreCase) ||
                    $"{p.Value.last} {p.Value.first}".Contains(searchString,
                        StringComparison.CurrentCultureIgnoreCase))
                .Select(p => new TypeAheadResult
                {
                    Id = p.Key,
                    Val = $"{p.Value.first} {p.Value.last}"
                })
                .OrderBy(p => p.Val)
                .Take(10)
                .ToArray();
        }
    }
}