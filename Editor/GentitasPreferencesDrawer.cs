using System.Linq;
using Entitas.Unity.Editor;
using Entitas.Utils;
using UnityEditor;
using UnityEngine;

namespace Entitas.Gentitas.Editor
{
    public class GentitasPreferencesDrawer : AbstractPreferencesDrawer
    {
        public override int priority { get { return 20; } }
        public override string title { get { return "Gentitas"; } }

        const string GENTITAS_ENABLE_PING_CSPROJ = "GENTITAS_ENABLE_PING_CSPROJ";

        GentitasConfig _gentitasConfig;

        bool _enablePingCSProj;

        public override void Initialize(Preferences preferences)
        {
            _gentitasConfig = new GentitasConfig();
            preferences.AddProperties(_gentitasConfig.defaultProperties, false);
            preferences.userProperties.AddProperties(_gentitasConfig.defaultUserProperties, false);
            _gentitasConfig.Configure(preferences);

            _enablePingCSProj = _gentitasConfig.enablePingCSPorj;
        }

        protected override void drawContent(Preferences preferences)
        {
            EditorGUILayout.BeginHorizontal();
            {
                drawEnablePingCSProj();
            }
            EditorGUILayout.EndHorizontal();

            drawOutputFolder();

            EditorGUILayout.Space();

            drawGenerateButton();
        }

        void drawEnablePingCSProj()
        {
            EditorGUI.BeginChangeCheck();
            {
                _enablePingCSProj = EditorGUILayout.Toggle("Enable Ping .csproj", _enablePingCSProj);
            }
            var changed = EditorGUI.EndChangeCheck();

            if (changed)
            {
                _gentitasConfig.enablePingCSPorj = _enablePingCSProj;
            }
        }

        void drawOutputFolder()
        {
            var path = EntitasEditorLayout.ObjectFieldOpenFolderPanel(
                "Outptut Folder",
                _gentitasConfig.outputFolderPath,
                _gentitasConfig.outputFolderPath
            );
            if (!string.IsNullOrEmpty(path))
            {
                var assetsPath = System.Text.RegularExpressions.Regex.Replace(path, ".*Assets", "Assets");
                if (!path.Contains("Assets"))
                {
                    Debug.LogError("Path does not contain 'Assets'!\nOutput path must be in 'Assets' folder.");
                    return;
                }

                if (!path.Contains("Generated"))
                {
                    Debug.LogError("Path does not contain 'Generated'!\nOutput path must be in 'Generated' folder.");
                    assetsPath = "Assets/Generated";
                }
                _gentitasConfig.outputFolderPath = assetsPath;
            }
        }

        void drawGenerateButton()
        {
            var bgColor = GUI.backgroundColor;
            GUI.backgroundColor = Color.green;
            if (GUILayout.Button("Generate", GUILayout.Height(32)))
            {
                MenuItems.StartGenerator();
            }
            GUI.backgroundColor = bgColor;
        }
    }
}