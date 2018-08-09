using System.Diagnostics;

namespace jaymvc.Models.Health
{
    public class SimpleHealthCheck
    {
        public string AssemblyVersion { get; }
        public SimpleHealthCheck()
        {
            AssemblyVersion = FileVersionInfo.GetVersionInfo(GetType().Assembly.Location).ProductVersion;
        }
    }
}