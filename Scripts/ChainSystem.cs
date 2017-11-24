namespace Gentitas
{
#if UNITY_EDITOR && !ENTITAS_DISABLE_VISUAL_DEBUGGING
    public class ChainSystem : Entitas.VisualDebugging.Unity.DebugSystems
    {
        public ChainSystem(string name) : base(name)
        {
        }
    }
#else
    public class ChainSystem: Entitas.Systems {
        public ChainSystem(string name) : base()
        {
        }
    }
#endif
}