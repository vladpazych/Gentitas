using UnityEngine;
using UnityEditor;
using System.IO;
using System.Diagnostics;

namespace Gentitas
{
    public static class Generator
    {
        [MenuItem("Tools/Entitas Gentitas/Check for Updates", false, 200)]
        public static void CheckForUpdates()
        {
            if (EditorUtility.DisplayDialog("Check For Updates", "Automatic check for updates is not available yet. You can check manually on GitHub.", "Go to GitHub page", "Cancel"))
            {
                Application.OpenURL("https://github.com/vladpazych/Gentitas");
            }
        }

        [MenuItem("Tools/Entitas Gentitas/Download Generator", false, 201)]
        public static void DownloadGenerator()
        {
            if (EditorUtility.DisplayDialog("Download Generator", "Automatic download is not available yet. You can download manually on GitHub.", "Go to GitHub Releases page", "Cancel"))
            {
                Application.OpenURL("https://github.com/vladpazych/Gentitas/releases");
            }
        }

        [MenuItem("Tools/Entitas Gentitas/Start Generator %g", false, 202)]
        public static void StartGenerator()
        {
            var path = Application.dataPath;
            path = Path.GetFullPath(Path.Combine(path, "Gentitas/Generator"));

            Process proc = new Process();
            proc.StartInfo.FileName = "Generator";
            proc.StartInfo.WorkingDirectory = path;
            proc.StartInfo.Arguments = path;
            proc.StartInfo.CreateNoWindow = false;
            proc.StartInfo.UseShellExecute = true;
            proc.StartInfo.RedirectStandardOutput = false;
            proc.StartInfo.RedirectStandardInput = false;
            proc.Start();
        }

        static void proc_OutputDataReceived(object sender, System.Diagnostics.DataReceivedEventArgs e)
        {
            System.Console.WriteLine(e.Data);
        }
    }
}