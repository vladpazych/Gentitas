using UnityEngine;
using UnityEditor;
using System.IO;
using System.Diagnostics;

namespace Entitas.Gentitas.Editor
{
    public static class MenuItems
    {
        [MenuItem("Tools/Entitas/Check Gentitas for Updates...", false, 10)]
        public static void CheckForUpdates()
        {
            if (EditorUtility.DisplayDialog("Check For Updates", "Automatic check for updates is not available yet. You can check manually on GitHub.", "Go to GitHub page", "Cancel"))
            {
                Application.OpenURL("https://github.com/vladpazych/Gentitas");
            }
        }

        [MenuItem("Tools/Entitas/Check System for Gentitas", false, 602)]
        public static void CheckSystem()
        {
            RunShellScript("CheckSystem");
        }


        [MenuItem("Tools/Entitas/Install Gentitas Dependencies", false, 603)]
        public static void InstallDependencies()
        {
            RunShellScript("InstallDependencies");
        }

        [MenuItem("Tools/Entitas/Start Gentitas Generator %g", false, 604)]
        public static void StartGenerator()
        {
            RunShellScript("StartGenerator");
        }

        public static void RunShellScript(string command)
        {
            var path = Application.dataPath;
            path = Path.GetFullPath(Path.Combine(path, "Plugins/Gentitas/Scripts"));
            string extname;

            if (SystemInfo.operatingSystemFamily == OperatingSystemFamily.Windows)
            {
                path = Path.Combine(path, "cmd");
                extname = ".cmd";
            }
            else
            {
                path = Path.Combine(path, "sh");
                extname = ".sh";
            }

            Process proc = new Process();
            proc.StartInfo.FileName = command + extname;
            proc.StartInfo.WorkingDirectory = path;
            proc.StartInfo.CreateNoWindow = false;
            proc.StartInfo.UseShellExecute = true;
            proc.StartInfo.RedirectStandardOutput = false;
            proc.StartInfo.RedirectStandardInput = false;
            proc.Start();
        }

        private static void proc_OutputDataReceived(object sender, System.Diagnostics.DataReceivedEventArgs e)
        {
            System.Console.WriteLine(e.Data);
        }
    }
}