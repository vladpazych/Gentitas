namespace Entitas.Gentitas.Declaration
{
    public interface IContextSettings { }

    public interface IDisableObserver : IContextSettings { }

    public class Context
    {
        protected static Group Group(Match match)
        {
            return new Group();
        }

        protected static Index Index(ValueComponent valueComponent, params Component[] flagComponents)
        {
            return new Index();
        }

        protected static FlagComponent Component()
        {
            return new FlagComponent();
        }

        protected static ValueComponent Component<T>()
        {
            return new ValueComponent();
        }
    }

    public class Context<T> : Context where T : Context { }
    public class Context<T, T2> : Context where T : Context { }
    public class Context<T, T2, T3> : Context where T : Context { }
    public class Context<T, T2, T3, T4> : Context where T : Context { }
    public class Context<T, T2, T3, T4, T5> : Context where T : Context { }

    public interface IFlagComponent
    {
        FlagComponent Group { get; }
        FlagComponent GroupSingle { get; }
    }
    public interface IValueComponent
    {
        ValueComponent Group { get; }
        ValueComponent GroupSingle { get; }
        ValueComponent Index { get; }
    }

    public class Component { }

    public class FlagComponent : Component, IFlagComponent
    {
        public FlagComponent Group { get { return this; } }
        public FlagComponent GroupSingle { get { return this; } }
        public FlagComponent Universal { get { return this; } }
    }

    public class ValueComponent : FlagComponent, IValueComponent
    {
        new public ValueComponent Group { get { return this; } }
        new public ValueComponent GroupSingle { get { return this; } }
        new public ValueComponent Universal { get { return this; } }
        public ValueComponent Index { get { return this; } }
    }

    public class Group
    {
        public Group Single { get { return this; } }
    }

    public class Index
    {
    }

    public class Matcher
    {
        public static Match All(params Component[] components)
        {
            return new Match();
        }

        public static Match Any(params Component[] components)
        {
            return new Match();
        }
    }

    public class Match
    {
        public Match All(params Component[] components)
        {
            return new Match();
        }

        public Match Any(params Component[] components)
        {
            return new Match();
        }

        public Match None(params Component[] components)
        {
            return new Match();
        }
    }
}
