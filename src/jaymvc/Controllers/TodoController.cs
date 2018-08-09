using System;
using System.Collections.Generic;
using jaymvc.Framework;
using jaymvc.Models.Home;
using jaymvc.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace jaymvc.Controllers
{
    public class TodoController : PureMvcControllerBase
    {
        private readonly ITodoService _todoService;

        public TodoController(ILoggerFactory logging, ITodoService todoService) : base(logging)
        {
            _todoService = todoService;
        }

        [HttpPost]
        public JsonResult TypeAhead(string q)
        {
            if(q?.Length < 2)
                return Json(JsonEnvelope.Error("Waiting for input..."));

            var data = _todoService.AssigneeSearch(q);
            if (data.Length > 0)
                return Json(JsonEnvelope.Success(data));

            return Json(JsonEnvelope.Error("No results found"));
        }
        
        [HttpPost]
        public JsonResult Save(Guid? id, Guid? assignedToId, ActionItemPriorityConstants? priority,  DateTime? due, string text)
        {
            var errors = new Dictionary<string, string>();
            if(due == null)
                errors.Add("due", "Due Date is required");
            
            if (string.IsNullOrWhiteSpace(text))
                errors.Add("text", "Test is required");
            
            if(assignedToId == null)
                errors.Add("assignedToName", "Assigned to is required");
            
            if (errors.Count > 0)
                return Json(JsonEnvelope.Error(errors));
            
            _todoService.Save(id, assignedToId.GetValueOrDefault(), priority.GetValueOrDefault(ActionItemPriorityConstants.Normal), due.GetValueOrDefault(), text);
            return Json(JsonEnvelope.Success());
        }
        
        [HttpPost]
        public PartialViewResult Add()
        {
            return PartialView(_todoService.New());
        }
        
        
        [HttpPost]
        public PartialViewResult Edit(Guid id)
        {
            return PartialView(_todoService.One(id));
        }
        
        
        [HttpPost]
        public PartialViewResult All()
        {
            return PartialView(_todoService.All());
        }
        
        [HttpPost]
        public JsonResult Complete(Guid id)
        {
            _todoService.Complete(id);
            return Json(JsonEnvelope.Success());
        }
    }
}
