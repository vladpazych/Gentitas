using System.Collections.Generic;
using Entitas.Utils;

namespace Entitas.Gentitas.Editor
{
    public class GentitasConfig : AbstractConfigurableConfig
    {
        const string ENABLE_PING_CSPROJ = "Entitas.Gentitas.EnablePingCSPorj";
        const string OUTPUT_PATH_FOLDER_PATH_KEY = "Entitas.Gentitas.OutputPath";

        public override Dictionary<string, string> defaultProperties
        {
            get
            {
                return new Dictionary<string, string> {
                    { OUTPUT_PATH_FOLDER_PATH_KEY, "Assets/Generated" }
                };
            }
        }

        public Dictionary<string, string> defaultUserProperties
        {
            get
            {
                return new Dictionary<string, string> {
                    { ENABLE_PING_CSPROJ, true.ToString() }
                };
            }
        }

        public string outputFolderPath
        {
            get { return _preferences[OUTPUT_PATH_FOLDER_PATH_KEY]; }
            set { _preferences[OUTPUT_PATH_FOLDER_PATH_KEY] = value;}
        }

        public bool enablePingCSPorj
        {
            get { return _preferences.userProperties[ENABLE_PING_CSPROJ] == true.ToString(); }
            set { _preferences.userProperties[ENABLE_PING_CSPROJ] = value.ToString(); }
        }
    }
}